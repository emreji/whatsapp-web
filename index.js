const express = require('express');
const http = require('http');

let app = express();
let server = http.createServer(app);
let io = require('socket.io')(server);

app.use(express.static(__dirname + "/public"));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
 })

io.on('connection', function(socket) {
    console.log('socket connected!');
})

server.listen(3000, function() {
    console.log('server running!', __dirname);
})
