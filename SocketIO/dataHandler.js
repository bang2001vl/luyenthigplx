/** 
 * @typedef {import("socket.io").Socket} Socket
 *  * @typedef {import("socket.io").Server} Server
 */

import { getUTCTimestamp } from "../Class/Model/timetamp";
import { historyRepos, practiceRepos } from "../Database/mysqlController";
import { SocketAuthEventHandler } from "./auth";
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

        console.log("SOCKET.IO: Insert histories");
        var a = await historyRepos.insertList(accountId, histories);
        console.log("SOCKET.IO: Insert practices");
        var b = await practiceRepos.insertOrUpdateList(accountId, practices);

        socket.emit("responsed_notify_data_changed", {
            "histories": a,
            "practices": b,
        });

        socket.broadcast.to(accountId).emit("data_changed");
    }

    /**
     * 
     * @param {Socket} socket 
     * @param {*} data
     */
    async onRequestUnsyncData(socket, data){
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
        console.log(JSON.stringify(data));
        // Check arguments
        /** @type {number} */
        var lastSyncTime = data["lastSync"];

        var sync_time = getUTCTimestamp();

        console.log("SOCKET.IO: Find histories");
        var unsync_history = await historyRepos.findNotSync(accountId, lastSyncTime);
        console.log("SOCKET.IO: Find practices");
        var unsync_practices = await practiceRepos.findNotSync(accountId, lastSyncTime);

        socket.emit("response_unsync_data", {
            "sync_time": sync_time,
            "histories": unsync_history,
            "practices": unsync_practices,
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

        let count = 0;
        count += await historyRepos.deleteByAccount(accountId);
        count += await practiceRepos.deleteByAccount(accountId);

        console.log(`SocketIO: Delete ${count} rows from accountId = ${accountId}`);

        io.to(accountId).emit("deleted_sync_data", {
            count: count,
        });
    }
}