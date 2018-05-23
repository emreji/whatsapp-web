var user;
var socketManager = new SocketManager();
var chats = {}; // {phoneNumber => chat}
var selectedChatUser;
var currentUserId;
var newUser;
var lastSelectedChat;

var modal = document.getElementById("login-form");
var loginButton = document.getElementById("login-button");
var currentChatName = document.getElementById("contact-name");
var currentcontactPicture = document.getElementById("contact-profile-picture");
var currentChatOnlineStatus = document.getElementById("contact-online-status");
var userNameOnLoad = document.getElementById("username").value;

modal.style.display = "block";

function setUsername() {
	
	var userName = document.getElementById("username").value;
	if(userName != "") {
		modal.style.display = "none";
		newUser = new User(userName, Math.random().toString(36).substr(2, 9));
		socketManager.login(newUser, function(user) {
			document.getElementById("user").innerHTML = user.userName;
			currentUserId = user.id;
		}, function(error) {
			alert(error);
		});
	} else {
		document.getElementsByClassName('error')[0].innerHTML = "Please provide a username to continue.";
		promptUsername();
	}
}

function sendMessage() {
	var message = $('#new-message').val();
	if (message != "" && message != null) {
		socketManager.sendMessage(selectedChatUser.id, message);
		
		var currentDate = new Date();
		var timeIndicator = (currentDate.getHours() < 12) ? "AM" : "PM";
		var displayTime = currentDate.getHours() % 12 + ":" + currentDate.getMinutes() + " " + timeIndicator;
		var chatBubble = new ChatBubble(message, displayTime, false);
		document.getElementById("new-message").value = "";
		addToChatBubblesAndRenderUI(selectedChatUser, chatBubble);
	}
}

// message has sender(id, name and phone number) and message body
var displayIncomingMessage = function(message) {
	var currentDate = new Date();
	var timeIndicator = (currentDate.getHours() < 12) ? "AM" : "PM";
	var displayTime = currentDate.getHours() % 12 + ":" + currentDate.getMinutes() + " " + timeIndicator;
	var chatBubble = new ChatBubble(message.message, displayTime, true);
	
	addToChatBubblesAndRenderUI(message.sender, chatBubble);
	console.log(document.getElementById("last-chat-message-" + message.sender.phoneNumber))
	document.getElementById("last-chat-message-" + message.sender.phoneNumber).innerHTML = message.message;
	if(message.sender.phoneNumber != selectedChatUser.phoneNumber) {
		document.getElementById("notify-" + message.sender.phoneNumber).className = "notifyNewMessage";
	}
}

var refreshContactList = function(contacts) {
	var chatList = document.getElementById("chat-list-ul");
	chatList.innerHTML = '';
	
	if(selectedChatUser == null && contacts.length > 0) {
		selectedChatUser = contacts[0];
	} 

	contacts.forEach(contact => {
		if(contact.phoneNumber != newUser.phoneNumber) {
			var loggedInUser = createChatContact(contact);
			loggedInUser.user = contact;
			if(chats[contact.phoneNumber] == null) {
				chats[contact.phoneNumber] = new Chat(contact, []);
			}
			
			loggedInUser.addEventListener("click", function() {
				this.style.backgroundColor = "#e4e4e4";
				document.getElementById("notify-" + this.user.phoneNumber).className = "";
				selectedChatUser = this.user;
				updateCurrentChat(selectedChatUser);
				loadPreviousChat(selectedChatUser);

				if (lastSelectedChat != null) {
					lastSelectedChat.style.backgroundColor = "#FFFFFF";
				}
				
				lastSelectedChat = this
			});

			chatList.appendChild(loggedInUser);
		}
	});
}

socketManager.receiveMessage(displayIncomingMessage);
socketManager.updateContactList(refreshContactList);

function updateCurrentChat(user) {
	currentChatName.innerHTML = user.userName;
	
}

// load previous chats from this 'user'
function loadPreviousChat(user) {
	$('.chat-window').empty();
	
	chats[user.phoneNumber].chatBubbles.forEach(chatBubble =>
		createChatBubbleDiv(chatBubble)	
	);
	scrollToBottomOfChatWindow();
}

function addToChatBubblesAndRenderUI(sender, chatBubble) {
	if(chats[sender.phoneNumber]) {
		chats[sender.phoneNumber].addChatBubble(chatBubble);
		if(sender.phoneNumber == selectedChatUser.phoneNumber) {
			createChatBubbleDiv(chatBubble);
		}
	}
	scrollToBottomOfChatWindow()
}

function createChatContact(user) {
	var li = document.createElement('li');
	li.id = user.id;

	var contactImageDiv = document.createElement('div');
	contactImageDiv.className = "contact-profile-picture-left";

	var contactImage = document.createElement("img");
	contactImage.src = "./images/profile-picture.png";

	contactImageDiv.appendChild(contactImage);

	var chatBoxDiv = document.createElement('div');
	chatBoxDiv.className = "chat-box";
	
	var chatContactDiv = document.createElement('div');
	chatContactDiv.className = "chat-contact";

	var chatContactNameDiv = document.createElement('div');
	chatContactNameDiv.className = "contact-name";
	chatContactNameDiv.innerHTML = user.userName;

	var notifyDiv = document.createElement("span");
	notifyDiv.id = "notify-" + user.phoneNumber;

	var lastChatMessageDiv = document.createElement('div');
	lastChatMessageDiv.className = "last-chat-message";
	lastChatMessageDiv.id = "last-chat-message-" + user.phoneNumber;
	lastChatMessageDiv.innerHTML = "Online";

	var chatTimeDiv = document.createElement('div');
	chatTimeDiv.className = "time";
	
	chatContactDiv.appendChild(chatContactNameDiv);
	chatContactDiv.appendChild(lastChatMessageDiv);
	chatBoxDiv.appendChild(chatContactDiv);
	chatBoxDiv.appendChild(chatTimeDiv);
	chatBoxDiv.appendChild(notifyDiv);

	li.appendChild(contactImageDiv);
	li.appendChild(chatBoxDiv);
	
	return li;
}

function scrollToBottomOfChatWindow() {
	var chatWindow = document.getElementById("chat-window");
	chatWindow.scrollTop = chatWindow.scrollHeight;
}

function createChatBubbleDiv(chatBubble) {
	var chatBubbleDiv = document.createElement('div');
	var messageSpan = document.createElement('span');
	var timeDiv = document.createElement('div');
	timeDiv.innerHTML = chatBubble.time;

	chatBubbleDiv.appendChild(messageSpan);
	messageSpan.innerHTML = chatBubble.message;
	messageSpan.appendChild(timeDiv);

	var classForMessage = (chatBubble.isReceived) ? "chat-bubble-received" : "chat-bubble-sent";
	chatBubbleDiv.setAttribute("class", "chat-bubble " + classForMessage);
	$('.chat-window').append(chatBubbleDiv);
	
}