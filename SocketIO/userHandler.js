/** 
 * @typedef {import("socket.io").Socket} Socket
 * @typedef {import("socket.io").Server} Server
 * @typedef {import("../Class/Model") * } 
 */
import { Buffer } from 'node:buffer';
import { writeFile } from "fs/promises";
import { userRepos } from "../Database/mysqlController";
import { onSocketUnauthorized, onSocketWrongProtocol } from "./utilities";
import { SocketEvent } from './event';
import { authEventHandler } from './authHandler';

export class SocketUserEventHandler {
    /**
     * 
     * @param {Socket} socket 
     * @param {*} data 
     */
    async onUpdateUserInfo(socket, data) {
        console.log("SOCKET.IO: onUpdateUserInfo");
        var accountId = authEventHandler.getSocketAccount(socket);
        if (accountId === undefined) {
            onSocketUnauthorized(socket);
            return;
        }

        let { name, rawimage } = data;
        if (typeof name !== 'string' || (rawimage !== undefined && !Array.isArray(rawimage))) {
            onSocketWrongProtocol(socket);
            return;
        }

        // PROCESS
        if (rawimage === undefined) {
            await userRepos.updateInfo(accountId, name);
        }
        else {
            let image = null;
            if (rawimage !== null) {
                image = Buffer.from(rawimage).toString('ascii');
            }
            await userRepos.updateInfo(accountId, name, image);
        }


        socket.emit(SocketEvent.event_userinfo_changed);
    }

    /**
     * 
     * @param {Socket} socket 
     */
    async onRequestUserInfo(socket) {
        console.log("SOCKET.IO: onRequestUserInfo");
        var accountId = authEventHandler.getSocketAccount(socket);
        if (accountId === undefined) {
            onSocketUnauthorized(socket);
            return;
        }

        // PROCESS
        let userInfos = await userRepos.findByAccountId(accountId);
        if (userInfos.length < 1) {
            onSocketUnauthorized(socket);
            return;
        }

        let userInfo = userInfos[0];
        delete userInfo.accountId;

        userInfo.rawimage = Buffer.from(userInfo.image, 'ascii').toJSON().data;
        delete userInfo.image;
        socket.emit(SocketEvent.response_get_userInfo, {
            "userInfo": userInfo,
        });
        console.log(JSON.stringify(userInfo));
    }
}