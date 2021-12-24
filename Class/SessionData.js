const { Socket } = require("socket.io");

class SessionData{
    isAuthorized = false;
    userID = -1;
    constructor(){

    }
}

/**
 * 
 * @param {Socket} socket 
 * @returns {SessionData} Session data of the socket
 */
function getSessionData(socket){
    return socket.handshake.session;
}

module.exports = {
    getSessionData,
    SessionData
}