/*

Author: Zhaoyang Li
Date: 2016-07-05

*/

/*

Usage:

	Modal.alert('hello');
	Modal.alert({
		content: 'drag me!'
	});
	Modal.alert({
		content: 'press W to close me!',
		draggable: false,
		closeKey: 87
	});

*/

var Modal = {

	_dom: 0,
	_mouseHotArea: 0,

	_key: -1,
	_draggable: false,
	_dragging: false,
	_lastX: -1,
	_lastY: -1,
	_eventHandler: function(ev){

		var event = ev? ev: window.event;
console.log(event.type)
		var key = event.keyCode;
		if(key === Modal._key){
			Modal.cancel();
		}
		if(Modal._draggable === true){
			var x = event.clientX;
			var y = event.clientY;
			if(Modal._lastX == -1){
				Modal._lastX = x;
				Modal._lastY = y;
			}else{
				switch(event.type){
					case 'mousemove':
						if(Modal._dragging){
							var newTop =
								parseInt(Modal._mouseHotArea.style.top.slice(0,-2) || 0) + (y - Modal._lastY) + 'px';
							Modal._mouseHotArea.style.top	= newTop;
							var newLeft =
								parseInt(Modal._mouseHotArea.style.left.slice(0,-2) || 0) + (x - Modal._lastX) + 'px';
							Modal._mouseHotArea.style.left	= newLeft;
						}
						break;
					case 'mousedown':
						var rect = Modal._mouseHotArea.getBoundingClientRect();
						if(x > rect.left && x < rect.right && y > rect.top && y < rect.bottom)
							Modal._dragging = true;
						break;
					case 'mouseup':
						Modal._dragging = false;
						break;
					case 'mouseout':
						if(event.fromElement === Modal._dom){
							Modal._dragging = false;
						}
						break;

				}
			}
			Modal._lastX = x;
			Modal._lastY = y;
		}
	},
	_alert: function(options){
		if(Modal._dom === 0){
			Modal._dom = document.createElement('div');
			Modal._dom.className = "modal-container";
			Modal._dom.style.display = 'none';
			Modal._dom.innerHTML = ' \
				<div class="modal-dialog"> \
					<div id="modal-content" class="not-selectable"></div> \
					<div class="modal-ok not-selectable" onclick="Modal.cancel()">OK</div> \
				</div> \
			';

			document.body.appendChild(Modal._dom);

			Modal._mouseHotArea = Modal._dom.children[0];

			Modal._dom.onmousedown = Modal._eventHandler;
			Modal._dom.onmouseup = Modal._eventHandler;
			Modal._dom.onmousemove = Modal._eventHandler;
			document.onmouseout = Modal._eventHandler;
			document.onkeyup = Modal._eventHandler;
		}

		document.getElementById('modal-content').innerHTML = options.content;

		Modal._key = options.closeKey;
		Modal._draggable = options.draggable;

		console.log("alerting with options");
		console.log(options);

		Modal._dom.style.display = '';
	},
	cancel: function(options){
		if(Modal._dom !== null){
			Modal._dom.style.display = 'none';
		}
		Modal._lastX = -1;
		Modal._mouseHotArea.style.top = "";
		Modal._mouseHotArea.style.left = "";

	},
	alert: function(options){
		if(typeof options === 'string'){
			options = {content: options};
		}else if(typeof options !== 'object' || typeof options.content !== 'string'){
			throw ("invalid options calling Modal.alert");
		}

		//reference: https://stackoverflow.com/questions/11197247/javascript-equivalent-of-jquerys-extend-method
		function extend(a, b){
			for(var key in b)
					if(b.hasOwnProperty(key))
							a[key] = b[key];
			return a;
		}

		options = extend({
			draggable: true,
			closeKey: 27 //Esc
		}, options);

		Modal._alert(options);
	}
};
