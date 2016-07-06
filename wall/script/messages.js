'use strict';

var numberOfMessages = 3; //maxium number of messages to be displayed

var messagesManager = new Vue({
  el: '#messages-container',
  data: {
    messages: []
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
  beforeLeave: function(){
    $('#messages-container').addClass('moving');
  },
	afterLeave: function(){
    $('#messages-container').removeClass('moving');
  },
})

function imageLoaded(el){
	$(el).removeClass('avatar-loading');
}

var buffer = []; //first in, first out

function messageHandler(message){
	if(typeof message.handimgurl !== 'undefined' && typeof message.headimgurl === 'undefined'){
		message.headimgurl = message.handimgurl;
	}
	console.log(message);
	buffer.push(message);
}

var timer = setInterval(function(){
	if(buffer.length > 0){
		messagesManager.newMessage(buffer.shift());
	}
	if(buffer.length > 233){
		console.warn("too many incoming messages");
		buffer = buffer.slice(-10);
	}
}, 400); //not to be less than 300ms, which is decided by CSS trasition


function test(interval){
	setInterval(function(){
		messageHandler({
			'content': "I am a message, " + ((new Date()).valueOf()/100).toFixed(20),
			'headimgurl': 'https://avatars2.githubusercontent.com/u/9985286',
			'nickname': 'Zhaoyang'
		});
	}, interval || 1000);
}

test();
