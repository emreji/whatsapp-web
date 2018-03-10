function SocketManager() {
    var socket = io();

    this.newUser = function(username, successCallback, errorCallback) {
        socket.emit('setUsername', username);
        socket.on('userSet', successCallback);
        socket.on('userExists', errorCallback);
    }

    this.sendMessage = function(message) {
        socket.emit('msg', {message: message});
    }

    this.receiveMessage = function(callback) {
        socket.on('newmsg', callback);
    }
}