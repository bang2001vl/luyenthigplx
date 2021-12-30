import { Server, Socket } from "socket.io";
import { createServer } from "http";
import console from "console";
import { onSocketUnauthorized} from "./utilities";
import { SocketAuthEventHandler } from "./auth";
import { SocketDataEventHandler } from "./dataHandler";

const server = createServer();
const io = new Server(server);

const auth = new SocketAuthEventHandler();
const dataEventHandler = new SocketDataEventHandler();

io.on("connection", (socket) => {
    console.log("Attemp from " + socket.id);
    socket.on("connect", () => {
        console.log("On connect from " + socket.id);
    });

    socket.on("authorize", (data) => {
        auth.onAuthorize(socket, data);
    });

    socket.on("notify_change_data", async (data) => {
        dataEventHandler.onNotifyNewData(socket, data);
    });

    socket.on("get_unsync_data", (data) => {
        dataEventHandler.onRequestUnsyncData(socket, data);
    });

    socket.on("delete_data", (data)=>{
        dataEventHandler.onDeleteData(socket, data, io);
    })

    setTimeout(function () {
        // If after 5s socket not auth yet, we will disconnect it
        if (!auth.checkSocketAuthorized(socket)) {
            console.log("Disconnect with reason timeout");
            onSocketUnauthorized(socket);
        }
    }, 5000);

    socket.on("disconnect", (reason) => {
        console.log(
            "SOCKET.IO: Disconnect client id = " +
            socket.id +
            " , with reason = " +
            reason
        );
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
