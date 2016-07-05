/*

Author: Zhaoyang Li
Date: 2016-07-04

*/


/*

Examples:

BackToTop.init({
	position: "TopLeft"
});

BackToTop.init({
	position: {x: 100, y: 100}
});

*/
var BackToTop = {
	_dom : 'hello, world',
	_y : 0, // animation
	_scroll_to_top: function(){
		BackToTop._y = BackToTop._get_scroll_y();
		console.log(BackToTop._y)
		BackToTop._scroll();
	},
	_scroll: function(){
		BackToTop._y = BackToTop._y - 100;
		window.scrollTo(0, BackToTop._y);
		if(BackToTop._y > 0){
			setTimeout(BackToTop._scroll, 1);
		}
	},
	_get_scroll_y: function(){
		return document.documentElement.scrollTop || window.scrollY || 0;
	},
	_scroll_listener: function(event){
		if(BackToTop._y > 0)
			return;
		var threshold1 = 100;
		var threshold2 = 1000;
		var y = BackToTop._get_scroll_y();
		BackToTop._setOpacity(Math.min(1, Math.max(0,y-threshold1) / threshold2));
	},

	_setOpacity: function(opacity){
		_dom.style.opacity = opacity;
		if(opacity === 0){
			_dom.style.display = 'none';
		}else{
			_dom.style.display = 'block';
		}
	},

	init: function(options){
		if(this._dom !== 'hello, world'){
			throw ('BackToTop.init() can only be called once!');
		}

		var css = ' \
			.back-to-top	{ \
				background: #ccc; \
				width:100px; \
				height:100px; \
				border-radius: 20px; \
				border: 5px #bbb solid; \
				position: fixed; \
				display: block; \
				cursor: pointer; \
			} \
			.back-to-top:hover	{ \
				background: #ddd; \
			} \
			.back-to-top-stick { \
				width: 20px; \
		    height: 50px; \
		    top: 38px; \
		    border-radius: 1px; \
		    background-color: #aaa; \
		    position: absolute; \
		    right: 0; \
		    left: 0; \
		    margin: auto; \
			} \
			.back-to-top-arrow { \
				position: absolute; \
				right: 0; \
				left: 0; \
				margin: auto; \
				width: 0; \
				height: 0; \
				top: -20px; \
				border: 30px solid transparent; \
				border-bottom-color: #aaa; \
			} \
		' ;

		//ref: https://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

		style.type = 'text/css';
		if (style.styleSheet){
		  style.styleSheet.cssText = css;
		} else {
		  style.appendChild(document.createTextNode(css));
		}
		head.appendChild(style);


		_dom = document.createElement('a');
		_dom.className = "back-to-top";
		_dom.style.display = 'none';


		var propertiesMap = {
			'TopLeft'   : ['left',  'top'],
			'BottomLeft' : ['left',  'bottom'],
			'TopRight'  : ['right', 'top'],
			'BottomRight': ['right', 'bottom']
		};

		var defaultMargin = "100px";

		if(
			typeof options === 'object'
			&& typeof options.position === 'object'
		){
			_dom.style.left = parseInt(options.position.x) + 'px';
			_dom.style.top  = parseInt(options.position.y) + 'px';
		}else if(typeof options.position === 'string'){
			var properties = propertiesMap[options.position];
			if(typeof properties !== 'undefined'){
				for(var i=0; i<properties.length; i++){
					_dom.style[properties[i]] = defaultMargin;
				}
			}
		}

		//geometry
		domArrow = document.createElement('div');
		domArrow.className = "back-to-top-arrow";
		domStick = document.createElement('div');
		domStick.className = "back-to-top-stick";
		_dom.appendChild(domArrow);
		_dom.appendChild(domStick);

		document.body.appendChild(_dom);


		_dom.onclick = BackToTop._scroll_to_top;

		if(window.addEventListener){
			window.addEventListener('scroll', BackToTop._scroll_listener);
		}else{
			window.attachEvent('onscroll', BackToTop._scroll_listener);
		}
		BackToTop._scroll_listener();

	}
};
