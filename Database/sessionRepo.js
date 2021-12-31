'use strict';

import { v4 as uuidv4 } from "uuid";
import { SessionModel } from "../Class/Model/session";
import { insertToDB, updateToDB } from "./utilities";

/**
 * @typedef {import("mysql2/promise").Pool} Pool} 
 */

export class SessionReposity {
    /**
     * 
     * @param {Pool} pool 
     */
    constructor(pool) {
        this.pool = pool;
        this.tableName = "session";
    }

    /**
     * Find session by token
     * @param {String} token 
     * @returns Return an empty list if not found
     */
    async findSession(token) {
        console.log(`Session: Find by token ${token}`);
        var sql = `SELECT * FROM ${this.tableName} WHERE token=?`;
        var [rows, f] = await this.pool.execute(sql, [token]);
        var rs = [];
        for (var i = 0; i < rows.length; i++) {
            rs.push(SessionModel.fromJSON(rows[i]));
        }
        console.log("here");
        return rs;
    }

    /**
     * Find session by token
     * @param {String} token 
     * @returns Return an empty list if not found
     */
     async findSessionByAccount(accountId) {
        var sql = `SELECT * FROM ${this.tableName} WHERE accountId=?`;
        var [rows, f] = await this.pool.execute(sql, [accountId]);
        var rs = [];
        for (var i = 0; i < rows.length; i++) {
            rs.push(SessionModel.fromJSON(rows[i]));
        }
        return rs;
    }

    /**
     * 
     * @param {UserModel} user 
     * @returns Token for session
     */
    async insertSession(accountId) {
        console.log(`Session: Insert session`);
        var token = await this.createToken();

        var session = new SessionModel({
            token: token,
            accountId: accountId,
        });

        var fields = [
            "token",
            "accountId",
        ];
        await insertToDB(this.pool, this.tableName, session, fields);
        return token;
    }

    /**
     * Find session by token
     * @param {String} token 
     * @returns New token
     */
    async updateSession(oldToken) {
        var token = await this.createToken();
        console.log(`Session: Update ${oldToken} -> ${token}`);
        var session = {
            "token": token,
        };

        var [result, f] = await updateToDB(this.pool, this.tableName, oldToken, session, null);
        //console.log(JSON.stringify(a));
        return token;
    }

    /**
     * 
     * @returns New unique token
     */
    async createToken() {
        var token = uuidv4();
        var temp = await this.findSession(token);
        while (temp.length > 0) {
            // Loop to find unique id
            console.log(`Session: Created token ${token}`);
            token = uuidv4();
            temp = await this.findSession(token);
        }
            console.log(`Session: Created token ${token}`);
        return token;
    }

    async deleteSessionByToken(token){
        console.log("Session: Delete by token " + token);
        let sql = `DELETE FROM ${this.tableName} WHERE token = ?`;
        var [result, f] = await this.pool.execute(sql, [token]);
        //console.log(JSON.stringify(result.ad));
        return result.affectedRows;
    }

    async updateDeviceInfo(token, device_info){
        console.log("Session: Update session with device info " + device_info);
        let sql = `UPDATE ${this.tableName} SET device_info=? WHERE token=?`;
        let [result, f] = await this.pool.execute(sql, [device_info, token]);
        return result.affectedRows;
    }
}