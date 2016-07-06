'use strict';

var numberOfMessages = 3;
var getUrl = "https://wall.cgcgbcbc.com/api/messages?num=" + numberOfMessages;
var socketUrl = "https://wall.cgcgbcbc.com"

function getOldMessages(callback){
	$.get(getUrl, function(data){
		data.forEach(function(i){
			callback(i);
		});
	});
}

function messageHandler(message){
	console.log(message);
}

var socket = io.connect(socketUrl);

socket.on('connect', function () {
  console.log('connected');
});

socket.on('disconnect', function() {
	console.log('disconnected');
  location.reload();
});

socket.on('new message', function(message){
	messageHandler(message);
});

socket.on('admin', function(message){
	message.isAdmin = true;
	messageHandler(message);
});

getOldMessages(function(message){
	message.isOld = true;
	messageHandler(message);
});
