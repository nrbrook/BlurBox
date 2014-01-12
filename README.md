# BlurBox

## Introduction

BlurBox is a lightbox which blurs the background.  Simple!

On small screens (<= 480px), a lightbox doesn't make much sense, so the plugin instead switches to a sheet which slides up from the bottom and just darkens the background (no blur)

### [Demo](http://nrbrook.github.io/BlurBox)

It is a jQuery plugin, but it wouldn't be much work to seperate out the jQuery goodness or even just substitute jQuery for a shim with the same interface.

I created this plugin for my personal website, [NickBrook.me](http://nickbrook.me)

## Usage

The plugin works as a [UMD jQuery Plugin](https://github.com/umdjs/umd/blob/master/jqueryPlugin.js) so can be loaded with an AMD loader or just as a normal script.

```javascript
$('#popupContent').blurbox().show();

// OR

new $.blurbox('#popupContent').show();

// OR

require(['blurbox'], function(BlurBox) {
	new Blurbox(document.getElementById('popupContent')).show();
});
```

## Prerequisites

This works by adding a blur filter to the main body content.  As such, you must have a container element which contains everything you want to blur that isn't the `body` element.  By default, the plugin uses the first child of body.  You can specify a different element as `options.bodyContent`

## Compatibility

While not well tested, this should work in IE 6+ (maybe), Firefox, Safari, Chrome, Opera

## Options

The options object can be passed in to the constructor, set afterwards using `object.applyOptions( options )`, or passed in to `show()` and `hide()`

Defaults can be set on BlurBox.defaults

`blur` (3) [px] The blur radius in pixels

`animateBlur` (true) [bool] If the plugin should use CSS transitions to animate the blur.  This can be slow on older browsers / low power graphics cards

`duration` (300) [ms] The duration of the show and hide animation

`autosize` (true) [bool] If true, the plugin will autosize the lightbox to fit the dimensions of the content.  Otherwise will use width/height 50%

`bgColor` ('rgba(0,0,0,0.2)') [colour string] If not null, the plugin will tint the background with this colour

`bodyContent` (null) [element] The plugin will blur this element.  By default, uses the first child of `body`

## Function Reference

### jQuery prototype constructor

#### jQuery().blurbox( options )

`options`	See [Options](#options)

### Blurbox plugin object

#### BlurBox( element | selector , options )

`element | selector`	This is the content of the lightbox you want to display
`options`	See [Options](#options)

#### BlurBox.hide( options )

Hide the currently active blurbox

`options`	See [Options](#options)

### BlurBox instance object

#### show( options )

Show the lightbox

`options`	See [Options](#options)

#### hide( options )

Hide the lightbox

`options`	See [Options](#options)

#### toggle( options )

Show or hide the lightbox

`options`	See [Options](#options)

#### applyOptions( options )

Set the options

`options`	See [Options](#options)

#### autosize( renderOffscreen )

Resize the lightbox to fit the content.  Use this if the content size changes

`renderOffscreen`	If true, positions the content offscreen to get its size.  If already displayed, pass `false` or no value

#### displayed

A boolean value which holds the current display status of the lightbox

#### element

The jQuery object for the DOM element this lightbox contains