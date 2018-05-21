function Chat(user, chatBubbles) {
    this.user = user;
    this.chatBubbles = chatBubbles;

    this.addChatBubble = function(chatBubble) {
        chatBubbles.push(chatBubble);
    }
}