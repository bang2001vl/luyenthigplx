class SocketAuthData{
    auth_token;
    username;
    constructor(auth_token, username){
        this.auth_token = auth_token;
        this.username = username;
    }
}

module.exports = {
    SocketAuthData
}