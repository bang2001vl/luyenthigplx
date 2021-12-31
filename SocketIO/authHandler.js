/** 
 * @typedef {import("socket.io").Socket} Socket
 */

import { authController, sessionRepos } from "../Database/mysqlController";
import { SocketEvent } from "./event";
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
        if (typeof (data.token) !== 'string' || data.device === undefined) {
            onSocketWrongProtocol(socket);
            return;
        }

        // Check session
        let {token, device} = data;
        let device_info = JSON.stringify(device);
        var reader = await authController.checkToken(token);
        if (reader === null) {
            socket.emit(SocketEvent.event_failed_authorized, {
                errorCode: 100,
                message: "Wrong token",
            });
            return;
        }

        console.log("SocketIO: Check session OK");
        let { userInfo, session } = reader;
        // Passed
        socket["accountId"] = session.accountId;
        socket["token"] = session.token;
        await sessionRepos.updateDeviceInfo(session.token, device_info);
        await socket.join(session.accountId);

        socket.emit(SocketEvent.event_authorized, {
            userInfo: userInfo,
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
        if(socket["token"] == undefined){
            onSocketUnauthorized(socket);
            return;
        }
        await sessionRepos.deleteSessionByToken(socket.token);
        socket["accountId"] = null;
        socket["token"] = null;
        socket.disconnect("Token detroyed");
    }
}