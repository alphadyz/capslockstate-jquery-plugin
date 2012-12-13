/*!
 * jQuery capslockstate plugin v1.1.0
 * https://github.com/nosilleg/capslockstate-jquery-plugin/
 *
 * Copyright 2012 Jason Ellison
 * Released under the MIT license
 * https://github.com/nosilleg/capslockstate-jquery-plugin/blob/master/MIT-LICENSE.txt
 *
 * Date: Thu Dec 13 2012 08:47:00 GMT
 */
(function($) {

	var capsLockState = "unknown";

	var methods = {
		init : function(options) {

			// Create some defaults, extending them with any options that were provided
			var settings = $.extend({
				// No defaults, because there are no options
			}, options);

			var helpers = {
				isCapslockOn : function(event) {

					var shiftOn = false;
					if (event.shiftKey) { // determines whether or not the shift key was held
						shiftOn = event.shiftKey; // stores shiftOn as true or false
					} else if (event.modifiers) { // determines whether or not shift, alt or ctrl were held
						shiftOn = !!(event.modifiers & 4);
					}
					
					var keyString = String.fromCharCode(event.which); // logs which key was pressed
					if (keyString.toUpperCase() === keyString.toLowerCase()) {
						// We can't determine the state for these keys
					} else if (keyString.toUpperCase() === keyString) {
						capsLockState = !shiftOn;
					} else if (keyString.toLowerCase() === keyString) {
						capsLockState = shiftOn;
					}

					return capsLockState;

				},

				isCapslockKey : function(event) {

					var keyCode = event.which; // logs which key was pressed
					if (keyCode === 20) {
						if (capsLockState !== "unknown") {
							capsLockState = !capsLockState;
						}
					}

					return capsLockState;

				},

				hasStateChange : function(previousState, currentState) {

					if (previousState !== currentState) {
						$('body').trigger("capsChanged");

						if (currentState === true) {
							$('body').trigger("capsOn");
						} else if (currentState === false) {
							$('body').trigger("capsOff");
						} else if (currentState === "unknown") {
							$('body').trigger("capsUnknown");
						}
					}
				}
			};

			return this.each(function() {

				// Check all keys
				$('body').bind("keypress.capslockstate", function(event) {
					var previousState = capsLockState;
					capsLockState = helpers.isCapslockOn(event);
					helpers.hasStateChange(previousState, capsLockState);
				});

				// Check if key was Caps Lock key
				$('body').bind("keydown.capslockstate", function(event) {
					var previousState = capsLockState;
					capsLockState = helpers.isCapslockKey(event);
					helpers.hasStateChange(previousState, capsLockState);
				});

				// If the window loses focus then we no longer know the state
				$(window).bind("focus.capslockstate", function() {
					var previousState = capsLockState;
					capsLockState = "unknown";
					helpers.hasStateChange(previousState, capsLockState);
				});

			});

		},
		state : function() {
			return capsLockState;
		},
		destroy : function() {
			return this.each(function() {
				$('body').unbind('.capslockstate');
				$(window).unbind('.capslockstate');
			})
		}
	}

	jQuery.fn.capslockstate = function(method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.capslockstate');
		}

	};
})(jQuery);