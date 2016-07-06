# WeWall Front-end

[demo](static.nullspace.cn/wft-assignments/wall)

You may execute `test()` in console to run local emulations.

Tested on Chrome 51.

## author

Zhaoyang,
student ID 2014013432,
lizy14@mails.tsinghua.edu.cn

## requirements met

### basic

all, noting that

- Long messages are just trimmed

### bonus

* data binding, using `Vue.js`

## notes on implementation

### abstract network interface
There is a single unitary interface to handle all 3 kinds of messages, including

* new messages, from `new message` event, websocket;
* old messages, from response to `get` request;
* administrator messages, from `admin` event, websocket;

Defined in `network.js` and being reusable, it lowers the coupling between networking the message handling logic, enables an easy implementation of local emulation, and makes the codes clean.

Uses Fetch API instead of traditional Ajax. I love the concept of Promises!

### message buffer
There is a FIFO buffer of incoming messages, to make sure that when too much messages arrives within a short period of time, the app does not crash or freeze up.


### user avatar
If an avatar takes too long to load, an alternative "anonymous" avatar is displayed instead. When loading finishes, the actual one fades out.

This feature involves `<img>`'s `onload` event.

### administrator messages
As an overlay.

### animation

* user avatar fading in;
* new messages coming in;
* old messages going out;
* admin message coming in;
* admin message going out;
* admin message replaced by a new one.

I love CSS3 transitions!

There is also a automatically scrolling bulletin area, located at the bottom, which is implemented with `<marquee>`.

### responsive layout
Taking advantage of CSS calc() function and relative length units, the content can always fill the window, and the page won't be broken when you do resizing.

Still, it's worth mentioning that this page looks best on 1024x768 full-screen display. This is practical, considering a typical projector.


### use of third-party libraries

* jQuery, only its selector and `addClass` `removeClass` methods, as syntactic sugar;
* Vue.js, to update the rendering of messages dynamically;
* socket.io, to handle websocket communications.

\#EOF
