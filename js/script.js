function sendMessage() {
	var message = $('#new-message').val();
	if (message != "" && message != null) {
		var currentDate = new Date();
		var timeIndicator = (currentDate.getHours() < 12) ? "AM" : "PM";
		var displayTime = currentDate.getHours() % 12 + ":" + currentDate.getMinutes() + " " + timeIndicator;
		
		var chatBubbleDiv = document.createElement('div');
		var messageSpan = document.createElement('span');
		var timeDiv = document.createElement('div');
		timeDiv.innerHTML = displayTime;

		chatBubbleDiv.appendChild(messageSpan);
		messageSpan.innerHTML = message;
		messageSpan.appendChild(timeDiv);

		chatBubbleDiv.setAttribute("class", "chat-bubble chat-bubble-sent");
		$('.chat-window').append(chatBubbleDiv);
		$('#new-message').val("");

		scrollToBottomOfChatWindow()
	}
}

function scrollToBottomOfChatWindow() {
	var chatWindow = document.getElementById("chat-window");
	chatWindow.scrollTop = chatWindow.scrollHeight;
}