// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {
	// Create the defaults once
	var pluginName = 'transitionFx';
	var defaults = {
		timeout: 	100
	};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.$element = $(element);

		this.options = $.extend( {}, defaults, options );

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype = {

		init: function () {
			//console.log(this._name, { element: this.$element });

			this.$transitionFx 		= this.$element.find('.transitionFx');

			this.initBlockOpacity();
			this.addEventListeners();

		},



		// By default transitionFx items within viewport should not have any effect
		// (forced by adding a class 'already-visible' to it)

		initBlockOpacity: function () {

			var index = false;

			// add 'is-visible' class to items currently in viewport ..
			this.$transitionFx.each(function (i) {

				var $this 		= $(this),
				    isVisible 	= $this.visible(true);

				if (isVisible) {
					setTimeout(function () {
						$this.addClass('come-in');
					}, 150 * index);
				}

				index = !index && isVisible ? i : index;

			});

			// .. but also on items which are before current pageYOffset
			this.$transitionFx.filter(':lt(' + index + ')').addClass('come-in');

		},



		// Add event listeners

		addEventListeners: function () {

			$(window).on('Mangrove:ScrollEvent', $.proxy(this, 'handleScroll'));

		},



		// Handle window scroll
		// Trigger an event after scrolling is finished; so only items get ..
		// .. effects applied after scrolling (to prevent a 'effects circus')

		handleScroll: function (event) {

			this.currentYOffset 	= window.pageYOffset;
			requestAnimFrame($.proxy(this, 'applyEffects'));

		},


		// Based on scrolldirection add some animation class to the different elements

		applyEffects: function () {

			var itemsVisible 		= 0;

			this.$transitionFx.each(function (i) {

				var $this 			= $(this),
				    isVisible 		= $this.visible(true);

				if (isVisible) {
					setTimeout(function () {
						$this.addClass('come-in')
					}, 150 * itemsVisible);
					itemsVisible++;
				}

			});

		}

	}

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
			}
		});
	};

})( jQuery, window, document );
