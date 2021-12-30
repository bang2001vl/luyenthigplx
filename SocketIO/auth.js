/** 
 * @typedef {import("socket.io").Socket} Socket
 */

import { authController, sessionRepos } from "../Database/mysqlController";
import { onSocketUnauthorized, onSocketWrongProtocol } from "./utilities";

export class SocketAuthEventHandler {
    /**
     * 
     * @param {Socket} socket 
     * @param {*} data 
     * @returns 
     */
    async onAuthorize(socket, data) {
        console.log("SocketIO: onAuthorize");
        console.log(JSON.stringify(data));
        // Check data
        if (typeof (data.token) !== 'string') {
            onSocketWrongProtocol(socket);
            return;
        }

        // Check session
        var reader = await authController.checkToken(data.token);
        if (reader === null) {
            socket.emit("authorize_failed", {
                errorCode: 100,
                message: "Wrong token",
            });
            return;
        }

        console.log("SocketIO: Check session OK");
        let { user, session } = reader;
        // Passed
        socket["accountId"] = user.id;
        socket["token"] = session.token;
        await socket.join(user.id, () => {
            console.log("SOCKET.IO: Join client " + socket.id + " to room account");
        });

        socket.emit("authorized", {
            userInfo: {
                name: user.name
            },
            token: session.token,
        });
    }
    /**
     * 
     * @param {Socket} socket 
     * @returns 
     */
    checkSocketAuthorized(socket) {
        let accountId = socket["accountId"];
        
        if (accountId === undefined || accountId === null) {
            return false;
        }
        return true;
    }

    /**
     * 
     * @param {Socket} socket 
     */
    getSocketAccount(socket) {
        return socket["accountId"];
    }

    /**
     * 
     * @param {Socket} socket 
     */
    async destroySession(socket) {
        await sessionRepos.deleteSessionByToken(socket.token);
        socket["accountId"] = null;
        socket["token"] = null;
        socket.disconnect("Token detroyed");
    }
}