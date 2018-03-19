var WhatsAppUser = function(id, userName, phoneNumber) {
    this.id = id;
    this.userName = userName;
    this.phoneNumber = phoneNumber;

    this.getJSON = function() {
        return {
            "id": this.id,
            "userName": this.userName,
            "phoneNumber": this.phoneNumber
        }
    }
}

module.exports = WhatsAppUser;