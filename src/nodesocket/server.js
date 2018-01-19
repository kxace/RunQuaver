console.log("Socket server is running");

var express = require('express');
var app = express();
// var server = app.listen(3000);
//app.use(express.static('public'));

var socket = require('socket.io');
//var io = socket(server);

//io.sockets.on('connection', newConnection);

var https = require('https');
var fs = require('fs');
var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('chan.pem')
};


var server = https.createServer(options, app).listen(3000);

var io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket) {
    socket.on('move', moveMsg);
    // console.log("new user logged in");
    function moveMsg(data) {
        socket.broadcast.emit('move', data);
        // console.log("Received: 'move' " + data.user + " " + data.x + " " + data.y);
    }
}
