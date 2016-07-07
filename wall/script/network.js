'use strict';

var oldMessagesUrl = "https://wall.cgcgbcbc.com/api/messages?num=3";
var socketIoUrl = "https://wall.cgcgbcbc.com";

function getOldMessages(callback){
	fetch(oldMessagesUrl)
		.then(function(data){
			return data.json();
		})
		.then(function(data){
			data.reverse().forEach(function(item){
				callback(item);
			});
		});
}

var socket = io.connect(socketIoUrl);

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
