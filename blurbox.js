;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($, undefined) {
	"use strict";
	
	var style = '\
.blurbox-hidden { display: none !important; }\
#blurbox-wrapper { overflow: hidden; padding: 10px; border-radius: 5px; background-color: white; opacity: 0; position: absolute; top: 50%; left: 50%; z-index: 9999; width: 50%; height: 50%; display: block; -webkit-transition: opacity 300ms; -moz-transition: opacity 300ms; -ms-transition: opacity 300ms; -o-transition: opacity 300ms; transition: opacity 300ms; }\
#blurbox-wrapper.blurbox-wrapper-fixed { position: fixed; margin: auto; }\
#blurbox-wrapper.blurbox-show { opacity: 1; }\
#blurbox-darkenbg { opacity: 0; top: 0; left: 0; background-color: rgba(0,0,0,0.2); z-index: 9999; position: absolute; height: 100%; width: 100%; -webkit-transition: opacity 300ms; -moz-transition: opacity 300ms; -ms-transition: opacity 300ms; -o-transition: opacity 300ms; transition: opacity 300ms; }\
#blurbox-darkenbg.blurbox-show { opacity: 1; }\
.blurbox-bodyContent { -webkit-transition: -webkit-filter 300ms, filter 300ms; -moz-transition: -moz-filter 300ms, filter 300ms; -o-transition: -o-filter 300ms, filter 300ms; -ms-transition: -ms-filter 300ms, filter 300ms; transition: filter 300ms; }\
.blurbox-bodyContent-show.blurbox-bodyContent-blur3 { filter: blur(3px); -webkit-filter: blur(3px); -moz-filter: blur(3px); -o-filter: blur(3px); -ms-filter: blur(3px); filter: url(blur.svg#blur3); }\
.blurbox-bodyContent-show.blurbox-bodyContent-blur6 { filter: blur(6px); -webkit-filter: blur(6px); -moz-filter: blur(6px); -o-filter: blur(6px); -ms-filter: blur(6px); filter: url(blur.svg#blur6); }\
';
	$('head').append('<style>'+style+'</style>');
	var pluginName = 'blurbox',
		defaults = {
			blur: 3,
			autosize: true,
			fixed: true,
			darken: true
		},
		plugin = function( element, options ) {
	        this.element = $(element);
			
	        this.options = $.extend( {}, defaults, options) ;
        
	        this._defaults = defaults;
	        this._name = pluginName;
        
	        this.init();
	    },
		// stores the active blurbox
		activeBlurbox;
	
	$.extend(plugin.prototype, {
		init: function() {
			this.displayed = false;
			this.element.detach();
			
			this.darkenbg = $('#blurbox-darkenbg');
			if(!this.darkenbg.length) {
				this.darkenbg = $('<div id="blurbox-darkenbg" class="blurbox-hidden">');
				$('body').append(this.darkenbg);
				this.darkenbg.click(function() {
					activeBlurbox.hide();
				});
			}
			
			this.wrapper = $('#blurbox-wrapper');
			if(!this.wrapper.length) {
				this.wrapper = $('<div id="blurbox-wrapper" class="blurbox-hidden">');
				$('body').append(this.wrapper);
			}
			
			this.bodyContent = this.options.bodyContent || $('body').children(':first');
			this.bodyContent.addClass('blurbox-bodyContent');
		},
		
		show: function(options) {
			if(!$.isPlainObject(options)) options = {};
			options = $.extend({}, this.options, options);
			
			if(activeBlurbox) {
				activeBlurbox.hide();
			}

			$(document).trigger('blurbox-willShow', this);

			this.element.detach();

			if(options.autosize) {
				this.autosize();
			}

			this.wrapper.html(this.element);
			this.element.show();
			this.bodyContent.addClass('blurbox-bodyContent-show blurbox-bodyContent-blur'+options.blur);
			this.wrapper.toggleClass('blurbox-wrapper-fixed', options.fixed);
			this.wrapper.removeClass('blurbox-hidden');
			if(options.darken) {
				this.darkenbg.removeClass('blurbox-hidden');
			}
			var t = this;
			setTimeout(function() {
				t.wrapper.addClass('blurbox-show');
				if(options.darken) {
					t.darkenbg.addClass('blurbox-show');
				}
				t.bodyContent.on('click.blurbox', $.proxy(t.hide,t));
			},0);
			this.wrapper.css({'margin-left':'-'+(this.wrapper.width()/2)+'px', 'margin-top':'-'+(this.wrapper.height()/2)+'px'})
			
			this.displayed = true;
			activeBlurbox = this;
			
			$(document).trigger('blurbox-didShow', this);
			
			return this;
		},

		hide: function() {
			$(document).trigger('blurbox-willHide', this);
			this.bodyContent.off('click.blurbox');
			this.wrapper.removeClass('blurbox-show');
			this.darkenbg.removeClass('blurbox-show');
			var t = this,
				endEvents = 'webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd',
				endAnim = function() {
					t.wrapper.addClass('blurbox-hidden');
					t.darkenbg.addClass('blurbox-hidden');
					t.wrapper.off(endEvents);
					clearTimeout(timeout);
				},
				timeout = setTimeout(endAnim, 350);
			this.wrapper.on(endEvents, endAnim);
			this.bodyContent.removeClass('blurbox-bodyContent-show blurbox-bodyContent-blur3');
			this.displayed = false;
			activeBlurbox = null;
			$(document).trigger('blurbox-didHide', this);
			return this;
		},

		toggle: function() {
			return this.displayed ? this.hide() : this.show();
		},

		autosize: function() {
			var style = this.element.attr('style');
			// render off screen for size
			this.element.css({position:'absolute',left:100000,display:'block'});
			$('body').append(this.element);
			var width = this.element.width();
			var height = this.element.height();
			this.element.detach();
			style ? this.element.attr('style', style) : this.element.removeAttr('style');
			this.wrapper.css({width:width,height:height});
		}
	});
	
	$.fn[pluginName] = function ( options ) {
		if(!this.length) return null;
		var p = $.data(this, 'plugin_' + pluginName);
        if (p) { return p; }
		p = new plugin( this, options );
		$.data(this, 'plugin_' + pluginName, p);
		return p;
    };
}));