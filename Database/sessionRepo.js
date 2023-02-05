'use strict';

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { AuthModel, UserModel } from "../Class/Model";
import { SessionModel } from "../Class/Model/session";
import { appConfig } from "../config";
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

    async deleteSessionByToken(token){
        console.log("Session: Delete by token " + token);
        const response = await axios.delete(
            `${appConfig.authServerURL}/session/delete/token?token=${token}`
        );
        return response.data.success ? 1 : 0;
    }

    async updateDeviceInfo(token, device_info){
        console.log("Session: Update session with device info " + device_info);
        return 1;
    }

    async checkSession(token){
        const response = await axios.post(
            `${appConfig.authServerURL}/session/check/token`,
            {
                token
            }
        );
        const data = response.data;
        if(!data.success){
            return null;
        }
        console.log("checkSession: done", {responseData: data})
        const account = new AuthModel({
            id: data.account.id,
            email: data.account.username,
        });
        const userInfo = new UserModel({
            accountId: account.id,
            name: data.userinfo.fullname,
        });
        const session = new SessionModel({
            token: token,
            accountId: account.id,
            createTime: new Date(data.session.createdAt),
            deviceInfo: "",
            lastTime: new Date(data.session.last_access_time),
        });
        return {
            account,
            userInfo,
            session,
        };
    }
}