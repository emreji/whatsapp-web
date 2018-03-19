var user;
var socketManager = new SocketManager();

promptUsername();

function promptUsername() {
	while(userName == null || userName == "") {
		var userName = this.prompt("Please enter your name");
		var newUser = new User(userName, "416-312-1932");
		socketManager.login(newUser, function(user) {
			document.getElementById("user").innerHTML = user.userName;
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

var refreshContactList = function(contacts) {
	var chatList = document.getElementById("chat-list-ul");
	chatList.innerHTML = '';

	contacts.forEach(contact => {
		var loggedInUser = createChatContact(contact.userName);
		loggedInUser.user = contact;

		loggedInUser.addEventListener("click", function() {
			console.log(this);
		});

		chatList.appendChild(loggedInUser);
	});
}

socketManager.receiveMessage(displayMessage);
socketManager.updateContactList(refreshContactList);

function createChatContact(name) {
	var li = document.createElement('li');

	var contactImageDiv = document.createElement('div');
	contactImageDiv.className = "contact-profile-picture-left";

	var contactImage = document.createElement("img");
	contactImage.src = "images/contact-profile-picture.jpg";

	contactImageDiv.appendChild(contactImage);

	var chatBoxDiv = document.createElement('div');
	chatBoxDiv.className = "chat-box";
	
	var chatContactDiv = document.createElement('div');
	chatContactDiv.className = "chat-contact";

	var chatContactNameDiv = document.createElement('div');
	chatContactNameDiv.className = "contact-name";
	chatContactNameDiv.innerHTML = name;

	var lastChatMessageDiv = document.createElement('div');
	lastChatMessageDiv.className = "last-chat-message";
	lastChatMessageDiv.innerHTML = "Hi";

	var chatTimeDiv = document.createElement('div');
	chatTimeDiv.className = "time";
	
	chatContactDiv.appendChild(chatContactNameDiv);
	chatContactDiv.appendChild(lastChatMessageDiv);
	chatBoxDiv.appendChild(chatContactDiv);
	chatBoxDiv.appendChild(chatTimeDiv);

	li.appendChild(contactImageDiv);
	li.appendChild(chatBoxDiv);
	return li;
}

function scrollToBottomOfChatWindow() {
	var chatWindow = document.getElementById("chat-window");
	chatWindow.scrollTop = chatWindow.scrollHeight;
}
