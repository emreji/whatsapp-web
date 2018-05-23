//import { WhatsAppUser } from './WhatsAppUser';

const express = require('express');
const http = require('http');

let app = express();
let server = http.createServer(app);
let io = require('socket.io')(server);
let WhatsAppUser = require('./WhatsAppUser');

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + '/node_modules'));

var loggedInUsers = []; // array of 'WhatsAppUser's who are logged in

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
 });

io.on('connection', function(socket) {
    console.log("New User Connected [Id: " + socket.id + "] " + loggedInUsers.length + " users are loggedIn right now.");

    socket.on('disconnect', function() {
        var userIndex = -1;
        for(var i = 0, len = loggedInUsers.length; i < len; i++) {
            if (loggedInUsers[i].id === socket.id) {
                userIndex = i;
                break;
            }
        }

        var disconnectedUser = loggedInUsers[userIndex];
        loggedInUsers.splice (userIndex, 1);
        if (disconnectedUser != null) {
            console.log(disconnectedUser.userName + ' is disconnected. ' + loggedInUsers.length + " users are loggedIn right now.");
        }

        var allUsers = [];
        loggedInUsers.forEach(user => {
            allUsers.push(user.getJSON());
        });

        io.sockets.emit("refreshContactList", allUsers);
    });

    socket.on('login', function (user) {
        var whatsAppUser = new WhatsAppUser(socket.id, user.userName, user.phoneNumber);
        
        if (loggedInUsers.includes(whatsAppUser)) {
            console.log(whatsAppUser.userName + " already exist");
            socket.emit("loginFailure", { "error": "UserName already taken. Please choose a different username!" }); 
        } else {
            loggedInUsers.push(whatsAppUser);
            console.log("Welcome " + whatsAppUser.userName + ". In total " + loggedInUsers.length + " users are logged in.");
            socket.emit("loginSuccess", whatsAppUser.getJSON());

            var allUsers = [];
            loggedInUsers.forEach(user => {
                allUsers.push(user.getJSON());
            });

            io.sockets.emit("refreshContactList", allUsers);
        }
    });

    // data contains receiver id and message.
    // sender id can be inferred from socket.id 
    socket.on('msg', function(data) {
        var sender = loggedInUsers.find(function (loggedInUser) {
            return (loggedInUser.id == socket.id);
        });

        var receiver = loggedInUsers.find(function (loggedInUser) {
            return (loggedInUser.id == data.receiverId);
        });

        var receiverSocket = io.sockets.sockets[data.receiverId];

        if (sender == null || receiver == null) {  
            console.log('Something went wrong: Sender: ' + sender + ', Receiver: ' + receiver);
            return;
        }

        console.log(sender.userName + " sent a message to " + receiver.userName + " => " + data.message);
        receiverSocket.emit('newmsg', {
            sender: sender,
            message: data.message
        });
    });
});

server.listen(process.env.PORT || 5000, function() { 
    console.log('server running!', __dirname); 
});
