/** 
 * @typedef {import("socket.io").Socket} Socket
 */

import { authController, sessionRepos } from "../Database/mysqlController";
import { SocketEvent } from "./event";
import { onSocketUnauthorized, onSocketWrongProtocol } from "./utilities";

const KEY_ACCOUNT_ID = "accountId";
const KEY_TOKEN = "token";
var sessionInfos = {};

function getSessionInfo(socket) {
    return sessionInfos[socket.id];
}

function saveSessionInfo(socket, accountId, token) {
    console.log("Auth: Saved session data of socket id = " + socket.id);
    let info = {};
    info[KEY_TOKEN] = token;
    info[KEY_ACCOUNT_ID] = accountId;

    sessionInfos[socket.id] = info;
    console.log(JSON.stringify(sessionInfos[socket.id]));
}

function deleteSessionInfo(socket) {
    console.log("Auth: Delete session data of socket id = " + socket.id);
    delete sessionInfos[socket.id];
}

export class SocketAuthEventHandler {
    /**
     * 
     * @param {Socket} socket 
     * @param {*} data 
     * @returns 
     */
    async onAuthorize(socket, data) {
        console.log("SocketIO: onAuthorize");
        //console.log(JSON.stringify(data));
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
        //console.log(JSON.stringify(session));
        // Passed
        saveSessionInfo(socket, session.accountId, session.token);

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
        let accountId = this.getSocketAccount(socket);
        
        if (accountId === undefined || accountId === null) {
            return false;
        }
        return true;
    }

    /**
     * 
     * @param {Socket} socket 
     * @returns {number} Account id, return undefined if not found
     */
    getSocketAccount(socket) {
        let c = getSessionInfo(socket);
        if(c === undefined) {
            console.log("Auth-connection: Cannot found socket id = " + socket.id);
            return undefined;
        }
        let accountId = c[KEY_ACCOUNT_ID];
        if(accountId === undefined){
            console.log("Auth: Cannot found accountId of socket id = " + socket.id);
        }
        return accountId;
    }

    /**
     * 
     * @param {Socket} socket 
     * @returns {String} Token, return undefined if not found
     */
     getSocketToken(socket) {
        let c = getSessionInfo(socket);
        if(c === undefined) return undefined;
        return c[KEY_TOKEN];
    }

    /**
     * 
     * @param {Socket} socket 
     */
    async destroySession(socket) {
        let token = this.getSocketToken(socket);
        if(token == undefined){
            onSocketUnauthorized(socket);
            return;
        }
        await sessionRepos.deleteSessionByToken(token);
        deleteSessionInfo(socket);
        console.log("Auth: Destroyed data of token : " + token);
    }
}

export const authEventHandler = new SocketAuthEventHandler();