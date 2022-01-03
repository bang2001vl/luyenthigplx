import { Server, Socket } from "socket.io";
import { createServer } from "http";
import console from "console";
import { onSocketUnauthorized} from "./utilities";
import { SocketAuthEventHandler } from "./authHandler";
import { SocketDataEventHandler } from "./dataHandler";
import { SocketEvent } from "./event";
import { SocketUserEventHandler } from "./userHandler";

const server = createServer();
const io = new Server(server);

const auth = new SocketAuthEventHandler();
const dataEventHandler = new SocketDataEventHandler();
const userEventHandler = new SocketUserEventHandler();

io.on("connection", (socket) => {
    console.log("Attemp from " + socket.id);
    socket.on("connect", () => {
        console.log("On connect from " + socket.id);
    });

    socket.on(SocketEvent.event_authorize, (data) => {
        auth.onAuthorize(socket, data);
    });

    socket.on(SocketEvent.event_authorized, ()=>{
        console.log("SocketIO: Authorized socket + " + socket.id);
    });

    socket.on(SocketEvent.request_insert_data, async (data) => {
        dataEventHandler.onNotifyNewData(socket, data);
    });

    socket.on(SocketEvent.request_get_unsync, (data) => {
        dataEventHandler.onRequestUnsyncData(socket, data);
    });

    socket.on(SocketEvent.request_deleted_data, (data)=>{
        dataEventHandler.onDeleteData(socket, data, io);
    });

    socket.on(SocketEvent.update_userInfo, (data) =>{
        userEventHandler.onUpdateUserInfo(socket, data);
    });

    socket.on(SocketEvent.request_get_userInfo, (data) =>{
        userEventHandler.onRequestUserInfo(socket, data);
    });

    setTimeout(function () {
        // If after 30s socket not auth yet, we will disconnect it
        if (!auth.checkSocketAuthorized(socket)) {
            console.log("Disconnect with reason timeout");
            onSocketUnauthorized(socket);
        }
    }, 30000);

    socket.on("disconnect", (reason) => {
        console.log(
            "SOCKET.IO: Disconnect client id = " +
            socket.id +
            " , with reason = " +
            reason
        );
        auth.destroySession(socket);
    });
});

/**
 * Start SocketIO server
 * @param {number} port
 */
export function initSocketIO(port) {
    server.listen(port, () => {
        console.log("SocketIO: Listening on port " + port);
    });
}
