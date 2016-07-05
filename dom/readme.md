# DOM Programming

## $

[demo](http://static.nullspace.cn/wft-assignments/dom/dollar-test.html)

### selector
Query selector wrapper, supporting

	$('.class')
	$('#id')
	$('tag')

Returns either `null`, or a single DOM element, or an array with 2 or more elements.

Internally it calls browser's `querySelectorAll`, `getElementsByTagName`, `getElementById`.

Just include `dollar.js` and you're good to go. Tested on IE 8/9/10, Chrome 51, Firefox 47, hereinafter the same.

### attributes accessor

Each element returned by the `$` selector has a `attr` method, allowing you to access or modify its attributes.

Usage: include `dollar.js` and write

	$('.foo').attr(attributeName);
	$('#bar').attr(attributeName, newValue);

Strictly speaking, internally it does nothing.

## widgets

[demo](http://static.nullspace.cn/wft-assignments/dom/widgets-test.html)

### BackToTop

Usage: include `backToTop.js` and write

	BackToTop.init({
		position: "TopLeft"
		// OR "TopRight", "BottomLeft", "BottomRight"
	});
	// OR
	BackToTop.init({
		position: {x: 100, y: 100} // in pixels
	});

Basically it does three things.
* It adds an `style` block into `head` to control the appearance of the widget,
* appends a `div.back-to-top` element into `body` which is the widget itself,
* and registers a listener to `scroll` events where visibility of the widget is updated.

Features include
* When you're at the top of the page, you don't see it.
* As you scroll down, it fades out.
* When you move your mouse over it, it changes your mouse pointer and its color to remind you that it is clickable.
* When you click it, there is an animation to bring you back to the top of the page.

### Modal

Usage: include `modal.js`, `modal.css` and write

	Modal.alert('hello');
	Modal.alert({
		content: 'drag me!'
	});
	Modal.alert({
		content: 'press W to close me!',
		draggable: false,
		closeKey: 87
	});

Appends a `div.modal-container` element to `body` and adds listeners to `keyup`,  `mousedown` `mouseup` `mouseout` `mousemove` events.

## analyzing a slider

[The slider to be analyzed](http://mami.baidu.com/main?channel=org) contains five items, each of which is a `div` element of a same class.

Defined by CSS properties `position`, `float` and `left`, the items are positioned one by one, side by side. But what really matters is their CSS3 `transform` `translate` properties, deciding the actual coordinates at which the pictures are presented.

There are some timers set by `setTimeout` calls to modify items' position, with CSS3 transition, regularly. That's where the animation comes from.

The page listens to many kinds of events. Remarkable ones are listed below:

* on `touchmove` event, it moves the items;
* on `touchend` event, it checks if the user intended to click, and initiates the navigation if true;
* on `resize` events, it updates the layout;
* on `touchstart`, `transitionend` events, it maintains some data structures.

Nothing done for bonus, \#EOF
