function SocketManager() {
    var socket = io();

    this.login = function(user, successCallback, errorCallback) {
        console.log(user.getJSON());
        socket.emit('login', user.getJSON());
        socket.on('loginSuccess', successCallback);
        socket.on('loginFailure', errorCallback);
    }

    this.sendMessage = function(message) {
        socket.emit('msg', {message: message});
    }

    this.receiveMessage = function(callback) {
        socket.on('newmsg', callback);
    }

    this.updateContactList = function(callback) {
        socket.on('refreshContactList', callback);
    }
}