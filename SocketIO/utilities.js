/**
 * @typedef {import("socket.io").Socket} Socket
 */
import { SocketEvent } from "./event";

 
 
 /** @param {Socket} socket*/
export function onSocketUnauthorized(socket) {
    socket.emit(SocketEvent.event_failed_authorized);
    console.log("SocketIO: onSocketUnauthorized");
    socket.disconnect();
}

/** @param {Socket} socket*/
export function onSocketWrongProtocol(socket) {
    console.log("SocketIO: onSocketWrongProtocol");
    socket.disconnect();
}