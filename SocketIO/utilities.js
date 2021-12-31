/**
 * @typedef {import("socket.io").Socket} Socket
 */ 
 
 /** @param {Socket} socket*/
export function onSocketUnauthorized(socket) {
    console.log("SocketIO: onSocketUnauthorized");
    socket.disconnect();
}

/** @param {Socket} socket*/
export function onSocketWrongProtocol(socket) {
    console.log("SocketIO: onSocketWrongProtocol");
    socket.disconnect();
}