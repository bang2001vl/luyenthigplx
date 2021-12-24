function getSessionData(socket){
    return socket.handshake.session;
}

function saveSessionData(socket){
    socket.handshake.session.save();
}

function detroySessionData(socket){
    socket.handshake.session = null;
}

export {
    getSessionData,
    saveSessionData,
    detroySessionData,
}