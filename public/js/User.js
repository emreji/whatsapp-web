function User(userName, phoneNumber) {
    this.userName = userName;
    this.phoneNumber = phoneNumber;

    this.getJSON = function() {
        return { 
            "userName": this.userName, 
            "phoneNumber": this.phoneNumber
        };
    }
}