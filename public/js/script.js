var user;
var socketManager = new SocketManager();

promptUsername();

function promptUsername() {
	while(userInput == null || userInput == "") {
		var userInput = this.prompt("Please enter your name");
		socketManager.newUser(userInput, function(user) {
			document.getElementById("user").innerHTML = user.username;
		}, function(error) {
			alert(error);
		});
	}
}

function sendMessage() {
	var message = $('#new-message').val();
	if (message != "" && message != null) {
		socketManager.sendMessage(message);
		scrollToBottomOfChatWindow()
	}
}

var displayMessage = function(message) {
	var currentDate = new Date();
	var timeIndicator = (currentDate.getHours() < 12) ? "AM" : "PM";
	var displayTime = currentDate.getHours() % 12 + ":" + currentDate.getMinutes() + " " + timeIndicator;
	
	var chatBubbleDiv = document.createElement('div');
	var messageSpan = document.createElement('span');
	var timeDiv = document.createElement('div');
	timeDiv.innerHTML = displayTime;

	chatBubbleDiv.appendChild(messageSpan);
	messageSpan.innerHTML = message.message;
	messageSpan.appendChild(timeDiv);

	chatBubbleDiv.setAttribute("class", "chat-bubble chat-bubble-sent");
	$('.chat-window').append(chatBubbleDiv);
	$('#new-message').val("");
}

socketManager.receiveMessage(displayMessage);

function scrollToBottomOfChatWindow() {
	var chatWindow = document.getElementById("chat-window");
	chatWindow.scrollTop = chatWindow.scrollHeight;
}
