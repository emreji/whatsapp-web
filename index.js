const express = require('express');
const http = require('http');

let app = express();
let server = http.createServer(app);
let io = require('socket.io')(server);
users = [];
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
 });

io.on('connection', function(socket) {
    console.log('socket connected!');

    socket.on('disconnect', function() {
        console.log('User disconnected.');
    });

    socket.on('setUsername', function (username) {
        if(users.indexOf(username) > -1) {
            socket.emit('userExists', username + ' username already taken. Please choose a different username!'); 
        } else {
            users.push(username);
            console.log(users);
            socket.emit('userSet', {username: username});
        }
    })

    socket.on('msg', function(data) {
        io.sockets.emit('newmsg', data);
    });
});

server.listen(3000, function() {
    console.log('server running!', __dirname);
});
