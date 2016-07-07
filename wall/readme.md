# WeWall Front-end

[demo](http://static.nullspace.cn/wft-assignments/wall)

You may execute `test()` in console to run local emulations.

Tested on Chrome 51.

## author

Zhaoyang,
student ID 2014013432,
lizy14@mails.tsinghua.edu.cn

## requirements met

### basic

all, noting that

- long messages are just trimmed.

### bonus

* data binding;
* support for emoji and wechat faces.

## notes on implementation

### abstract network interface
There is a single unitary interface to handle all 3 kinds of messages, including

* new messages, from `new message` event, websocket;
* old messages, from response to `get` request;
* administrator messages, from `admin` event, websocket.

Defined in `network.js` and being reusable, it lowers the coupling between networking and the message handling logic, enables an easy implementation of local emulation, and makes the codes clean.

Uses Fetch API instead of traditional Ajax.

### message buffer
There is a FIFO buffer of incoming messages, to make sure that when too much messages arrives within a short period of time, the app does not crash or freeze up.

> networking -> messageHandler -> [buffer] -> messageDispatcher -> messagesManager -> rendering

### user avatar
If an avatar takes too long to load, an "anonymous" avatar is displayed instead. When loading finishes, the actual one fades out.

This feature involves `<img>`'s `onload` event.

### administrator messages
Displayed as an overlay.

### animation

I love CSS3 transition!

* user avatar fading in;
* new messages coming in;
* old messages going out;
* admin message coming in;
* admin message going out;
* admin message replaced by a new one.

I love CSS3 keyframe animation!

* automatically scrolling bulletin area.

### responsive layout
Taking advantage of CSS relative length units, the content of the page can always fill the window. I'm confident to say that this page looks good everywhere - desktop and mobile, portrait and landscape, from 21:9 to 5:4, from 320x240 to 2048x1536.

### use of third-party libraries

Libraries are loaded from CDN, meaning that you need an active Internet connection.

* [jQuery](https://github.com/jquery/jquery/), only its `$` selector and `addClass` `removeClass` methods, as syntactic sugar;
* [Vue.js](https://github.com/vuejs/vue), to update the rendering of messages dynamically;
* [socket.io](https://github.com/socketio/socket.io-client), to handle websocket communications;
* [twemoji](https://github.com/twitter/twemoji), to translate emoji into images;
* [wechatface](https://github.com/weixinhost/wechatface), to translate wechat faces into images.


\#EOF
