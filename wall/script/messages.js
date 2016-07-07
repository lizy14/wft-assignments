'use strict';

var numberOfMessages = 3; //maxium number of messages to be displayed

var messagesManager = new Vue({
  el: '.page-container',
  data: {
    messages: [],
		admin: []
  },
  methods: {
    newMessage: function(message){
			messagesManager.messages.push(message);
			if(messagesManager.messages.length > numberOfMessages){
					messagesManager.messages.shift();
			}
		}
  }
});

Vue.transition('item', {
	beforeLeave: function(el){
		$('#messages-container').addClass('moving');
  },
	afterLeave: function(el){
		$('#messages-container').removeClass('moving');
  },
});

function imageLoaded(el){
	$(el).removeClass('avatar-loading');
}

var buffer = []; //first in, first out

var adminTimer = null;

function messageHandler(message){
	if(typeof message.handimgurl !== 'undefined' && typeof message.headimgurl === 'undefined'){
		message.headimgurl = message.handimgurl;
	}
	if(message.isAdmin){
		message.headimgurl = "image/admin.jpg";
	}

	console.log(message);

	message.content = twemoji.parse(message.content);
	message.content = wechatFace.faceToHTML(message.content);

	if(message.isAdmin === true){
		function clearAdmin(){
			while(messagesManager.admin.pop());
		}
		if(adminTimer !== null){
			clearTimeout(adminTimer);
		}
		adminTimer = setTimeout(function(){
				clearAdmin();
				adminTimer = null;
		}, 10 * 1000);
		clearAdmin();
		setTimeout(function(){
			messagesManager.admin.push(message);
		}, 400);

	}else{
		buffer.push(message);
	}
}

var timer = setInterval(function(){
	if(buffer.length > 0){
		messagesManager.newMessage(buffer.shift());
	}
	if(buffer.length > 233){
		console.warn("too many incoming messages");
		buffer = buffer.slice(-10);
	}
}, 400);


function test(interval){
	setTimeout(function(){
		messageHandler({
			'content': "I am the administrator, " + ((new Date()).toLocaleString()),
			'nickname': 'ADMIN',
			'isAdmin': true
		});
	}, 4000);
	setTimeout(function(){
		messageHandler({
			'content': "I am another administrator, " + ((new Date()).toLocaleString()),
			'nickname': 'Justin',
			'isAdmin': true
		});
	}, 8000);
	setInterval(function(){
		messageHandler({
			'content': "/::)\u2764\uFE0F I am a message, " + ((new Date()).toLocaleString()),
			'headimgurl': 'https://avatars2.githubusercontent.com/u/9985286',
			'nickname': 'Zhaoyang',
		});
	}, interval || 1000);
}


//test();
