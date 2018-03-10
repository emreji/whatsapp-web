const express = require('express');
const http = require('http');

let app = express();
let server = http.createServer(app);
let io = require('socket.io')(server);

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

    socket.on('msg', function(data) {
        io.sockets.emit('newmsg', data);
    });
});

var clients = 0;
io.on('connection', function(socket) {
    clients++;
    io.sockets.emit('broadcast', {description: clients + 'clients connected!'});
    socket.on('disconnect', function () {
        clients--;
        io.sockets.emit('broadcast', {description: clients + 'clients connected!'});
    })
})



server.listen(3000, function() {
    console.log('server running!', __dirname);
});
