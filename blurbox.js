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
body, html { width: 100%; height: 100%; margin: 0; padding: 0; }\
.blurbox-noscroll { overflow: hidden; height: 100%; width: 100%; }\
.blurbox-hidden { display: none !important; }\
#blurbox-wrapper { overflow: auto; padding: 10px; border-radius: 5px; background-color: white; opacity: 0; position: fixed; top: 50%; left: 50%; z-index: 9999; width: 50%; height: 50%; max-width: 95%; max-height: 95%; display: block; }\
#blurbox-wrapper.blurbox-small { box-sizing: border-box; }\
#blurbox-wrapper.blurbox-show { opacity: 1; }\
#blurbox-darkenbg { opacity: 0; top: 0; left: 0; z-index: 9998; position: fixed; height: 100%; width: 100%; }\
#blurbox-darkenbg.blurbox-show { opacity: 1; }\
@media (max-width: 480px) {\
	#blurbox-wrapper { margin: 0; left: 0; height: 100%; width: 100%; top: 100%; opacity: 1; border-radius: 0; max-height: none; max-width: none; }\
	#blurbox-wrapper.blurbox-show { top: 0; }\
}\
';

	$('head').append('<style>'+style+'</style>');
	var pluginName = 'blurbox',
		plugin = function( element, options ) {
	        this.element = $(element);
	        this.options = $.extend( {}, plugin.defaults );
	        this.applyOptions(options);
	        this._init();
	    };
		
	$.extend(plugin, {
		defaults: {
			blur: 3,
			animateBlur: true,
			duration: 500,
			compactTimingFunction: null,
			compactTimingFunctionIn: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
            compactTimingFunctionOut: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
			autosize: true,
			bgColor: 'rgba(0,0,0,0.2)',
			bodyContent: null
		},
		activeBlurbox: null,
		darkenbg: null,
		wrapper: null,
		bodyContent: null,
		styleProps: {
			filter: 'filter',
			transition: 'transition'
		},
		cssProps: {
			filter: 'filter',
			transition: 'transition'
		},
		stylePropVals: {
			filter: 'blur({blur}px)',
			transition: '{prop} {dur}ms {timing}'
		},
		stylePrefixes: ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'],
		transitionEndEvents: 'webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd',
		_init: function() {
			this.darkenbg = $('#blurbox-darkenbg');
			if(!this.darkenbg.length) {
				this.darkenbg = $('<div id="blurbox-darkenbg" class="blurbox-hidden">');
				$('body').append(this.darkenbg);
				this.darkenbg.click(function() {
					plugin.activeBlurbox.hide();
				});
			}
			
			this.wrapper = $('#blurbox-wrapper');
			if(!this.wrapper.length) {
				this.wrapper = $('<div id="blurbox-wrapper" class="blurbox-hidden">');
				$('body').append(this.wrapper);
			}
			
			this.bodyContent = $('.blurbox-bodyContent').first();
			
			this._determineProps();
		},
		_testStylePrefixes: function(s, prop, testVal) {
			// test no prefix first
			if(s[prop] !== undefined) {
				s[prop] = testVal;
				if(s[prop] === testVal) {
					plugin.styleProps[prop] = prop;
					plugin.cssProps[prop] = prop;
					return;
				}
			}
			var capprop = prop.substr(0,1).toUpperCase()+prop.substr(1),
				testprop;
			$.each(this.stylePrefixes, function(i,v) {
				testprop = v+capprop;
				// check if the property exists
				if(s[testprop] !== undefined) {
					// try setting it (for webkit)
					s[testprop] = testVal;
					if(s[testprop] === testVal) {
						plugin.styleProps[prop] = testprop;
						plugin.cssProps[prop] = '-'+v.toLowerCase()+'-'+prop;
						return false;
					}
				}
			});
		},
		_determineProps: function() {
			var s = $('<div>')[0].style;
			plugin._testStylePrefixes(s, 'filter', 'blur(3px)');
			plugin._testStylePrefixes(s, 'transition', 'width 100ms');
		},
		_applyProp: function(el,prop,subs) {
			var val = plugin.stylePropVals[prop];
			if($.isPlainObject(subs)) {
				$.each(subs, function(k,v) {
					val = val.replace('{'+k+'}', v);
				});
			} else {
				// array of property values
				var vals = [];
				$.each(subs, function(i,sub) {
					$.each(sub, function(k,v) {
						vals.push(val.replace('{'+k+'}', v));
					});
				});
				val = vals.join(', ');
			}
			
			el.style[plugin.styleProps[prop]] = val;
		},
		_removeProp: function(el, prop) {
			el.style[plugin.styleProps[prop]] = '';
		},
		hide: function(options) {
			if(this.activeBlurbox) {
				this.activeBlurbox.hide(options);
			}
		}
	});
	
	plugin._init();
	
	$.extend(plugin.prototype, {
		_init: function() {
			this.displayed = false;
			this.element.detach();
		},

		_updateStyles: function () {
            var isSmall = $('body').width() <= 480;
            var timing = (isSmall && (this.options.compactTimingFunction || this.options['compactTimingFunction' + (this.displayed ? 'Out' : 'In')])) || 'linear';
            plugin._applyProp(plugin.wrapper[0], 'transition', {prop:isSmall ? 'top' : 'opacity',dur:this.options.duration,timing: timing});
            plugin._applyProp(plugin.darkenbg[0], 'transition', {prop:'opacity',dur:this.options.duration, timing: 'linear'});
            if(this.options.animateBlur) {
                plugin._applyProp(this.bodyContent[0], 'transition', {prop:plugin.cssProps.filter,dur:this.options.duration, timing: 'linear'});
            } else {
                plugin._removeProp(this.bodyContent[0], 'transition');
            }

            plugin.darkenbg.css('backgroundColor', this.options.bgColor || '');
        },
		
		applyOptions: function(options) {
			this.options = $.extend(this.options, options);
			
			this.bodyContent = this.options.bodyContent || plugin.bodyContent;
            if(!this.bodyContent || this.bodyContent.length == 0) {
                console.error('Please pass your main body container element as the bodyContent option or give it the class \'.blurbox-body\'');
                return;
            }

			this.bodyContent.addClass('blurbox-bodyContent');
			
			this._updateStyles();
		},
		
		show: function(options) {
			this.applyOptions((options && $.isPlainObject(options)) || {});
			
			if(plugin.activeBlurbox) {
				plugin.activeBlurbox.hide();
			}

			$(document).trigger('blurbox.willShow', this);

			this.element.detach();

			var isBig = $('body').width() > 480;

            plugin.wrapper.addClass(isBig ? 'blurbox-big' : 'blurbox-small');

			if(isBig && this.options.autosize) {
				this.autosize(true);
			}
			
			// prevent scroll on body
			this.bodyContent.addClass('blurbox-noscroll');
			// set the popup content and 'show' it
			plugin.wrapper.html(this.element);
			this.element.show();
			// blur it
			if(isBig && this.options.animateBlur && this.options.blur > 0) {
				plugin._applyProp(this.bodyContent[0], 'filter', {blur:this.options.blur});
			}
			plugin.wrapper.removeClass('blurbox-hidden');
			if(this.options.bgColor) {
				plugin.darkenbg.removeClass('blurbox-hidden');
			}
			if(isBig) {
				plugin.wrapper.css({'margin-left':'-'+(plugin.wrapper.width()/2)+'px', 'margin-top':'-'+(plugin.wrapper.height()/2)+'px'})
			}
			
			var t = this,
				endAnim = function() {
					if(!t.options.animateBlur && t.options.blur > 0) {
						plugin._applyProp(t.bodyContent[0], 'filter', {blur:t.options.blur});
					}
					plugin.wrapper.off(plugin.tranisitionEndEvents);
					clearTimeout(timeout);
				},
				timeout;
			// set timeout at 0 to let elements be rendered first after display:none has been removed
			setTimeout(function() {
				plugin.wrapper.addClass('blurbox-show');
				if(t.options.bgColor) {
					plugin.darkenbg.addClass('blurbox-show');
				}
				t.bodyContent.on('click.blurbox', $.proxy(t.hide,t));
				
				timeout = setTimeout(endAnim, t.options.duration+50);
				plugin.wrapper.on(plugin.tranisitionEndEvents, endAnim);
			},0);
			
			this.displayed = true;
			plugin.activeBlurbox = this;
			
			$(document).trigger('blurbox.didShow', this);
			
			return this;
		},

		hide: function(options) {
			this.applyOptions((options && $.isPlainObject(options)) || {});

			$(document).trigger('blurbox.willHide', this);
			this.bodyContent.off('click.blurbox');
			// allow scroll on body
			this.bodyContent.removeClass('blurbox-noscroll');
			// hide the wrapper
			plugin.wrapper.removeClass('blurbox-show');
			// hide the overlay
			plugin.darkenbg.removeClass('blurbox-show');
			// set a timeout and listen for transition end events, whichever happens first end the animation
			var endAnim = function() {
					// at end of animation, display:none the wrapper
					plugin.wrapper.addClass('blurbox-hidden').removeClass('blurbox-big').removeClass('blurbox-small');
                    plugin.wrapper.css({height:'',width:'','margin-left':'', 'margin-top':''});
					// and the overlay
					plugin.darkenbg.addClass('blurbox-hidden');
					// stop listening for animation end events and clear the timeout
					plugin.wrapper.off(plugin.tranisitionEndEvents);
					clearTimeout(timeout);
				},
				timeout = setTimeout(endAnim, this.options.duration);
			plugin.wrapper.on(plugin.tranisitionEndEvents, endAnim);
			plugin._removeProp(this.bodyContent[0], 'filter');
			this.displayed = false;
			plugin.activeBlurbox = null;
			$(document).trigger('blurbox.didHide', this);
			return this;
		},

		toggle: function(options) {
			return this.displayed ? this.hide(options) : this.show(options);
		},

		autosize: function(renderOffscreen) {
			if(renderOffscreen) {
				var style = this.element.attr('style');
				// render off screen for size
				this.element.css({position:'absolute',left:'100000px',display:'block'});
				$('body').append(this.element);
			}
			var width = this.element.width();
			var height = this.element.height();
			if(renderOffscreen) {
				this.element.detach();
				style ? this.element.attr('style', style) : this.element.removeAttr('style');
			}
			plugin.wrapper.height(height);
			plugin.wrapper.width(width);
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
	
	$[pluginName] = plugin;
}));