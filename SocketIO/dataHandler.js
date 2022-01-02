/** 
 * @typedef {import("socket.io").Socket} Socket
 * @typedef {import("socket.io").Server} Server
 * @typedef {import("../Class/Model") * } 
 */

import { getUTCTimestamp } from "../Class/Model/timetamp";
import { historyRepos, practiceRepos, userRepos } from "../Database/mysqlController";
import { SocketAuthEventHandler } from "./authHandler";
import { SocketEvent } from "./event";
import { onSocketUnauthorized, onSocketWrongProtocol } from "./utilities";

export class SocketDataEventHandler{
    constructor(){
        this.auth = new SocketAuthEventHandler();
    }
    /**
     * 
     * @param {Socket} socket 
     * @param {*} data
     */
    async onNotifyNewData(socket, data){
        console.log("SOKCET.IO: onNotifyDataChanged");
        // Check authorized
        var accountId = this.auth.getSocketAccount(socket);
        if (accountId === undefined) {
            onSocketUnauthorized(socket);
            return;
        }

        // Check data
        if (data === null || data["histories"] === undefined || data["practices"] === undefined) {
            onSocketWrongProtocol(socket);
            return;
        }
        // console.log(JSON.stringify(data));

        // Check arguments
        var {histories, practices} = data;

        if (!Array.isArray(histories) || !Array.isArray(practices)) {
            onSocketWrongProtocol(socket);
            return;
        }

        var a = await historyRepos.insertList(accountId, histories);
        var b = await practiceRepos.insertOrUpdateList(accountId, practices);

        socket.emit(SocketEvent.response_notify_changed, {
            "histories": a,
            "practices": b,
        });

        socket.broadcast.to(accountId).emit(SocketEvent.event_data_changed);
    }

    /**
     * 
     * @param {Socket} socket 
     * @param {*} data
     */
    async onRequestUnsyncData(socket, data){
        console.log("SOKCET.IO: onRequestUnsync");
        //console.log(JSON.stringify(data));
        // Check authorized
        var accountId = this.auth.getSocketAccount(socket);
        if (accountId === undefined) {
            onSocketUnauthorized(socket);
            return;
        }

        // Check data
        if (data === null) {
            onSocketWrongProtocol(socket);
            return;
        }
        // Check arguments
        /** @type {number} */
        var lastSyncTime = data["lastSync"];

        var sync_time = getUTCTimestamp();

        var unsync_history = await historyRepos.findNotSync(accountId, lastSyncTime);
        var unsync_practices = await practiceRepos.findNotSync(accountId, lastSyncTime);

        var userInfo = (await userRepos.findByAccountId(accountId))[0];
        if(userInfo.updateTime < lastSyncTime){
            userInfo = null;
        }

        socket.emit(SocketEvent.response_get_unsync, {
            "sync_time": sync_time,
            "histories": unsync_history,
            "practices": unsync_practices,
            "userInfo": userInfo,
        });
    }

    /**
     * 
     * @param {Socket} socket 
     * @param {*} data
     * @param {Server} io
     */
    async onDeleteData(socket, data, io){
        var accountId = this.auth.getSocketAccount(socket);
        if (accountId === undefined) {
            onSocketUnauthorized(socket);
            return;
        }

        let deleteTime = getUTCTimestamp();

        let count = 0;
        count += await historyRepos.deleteByAccount(accountId);
        count += await practiceRepos.deleteByAccount(accountId);

        await userRepos.updateLatestDelete(accountId, deleteTime);

        console.log(`SocketIO: Delete ${count} rows from accountId = ${accountId}`);

        // io.to(accountId).emit("deleted_sync_data", {
        //     count: count,
        //     "delete_time": deleteTime,
        // });
        io.to(accountId).emit(SocketEvent.event_data_changed);
    }
}