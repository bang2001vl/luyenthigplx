'use strict';

import axios from "axios";
import { UserModel } from "../Class/Model";
import { getUTCTimestamp } from "../Class/Model/timetamp";
import { appConfig } from "../config";
import { insertToDB, updateToDB } from "./utilities";

/**
 * @typedef {import("mysql2/promise").Pool} Pool} 
 * @typedef {import("../Class/Model").UserModel} UserModel}
 */

export class UserInfoReposity {
    /**
     * 
     * @param {Pool} pool 
     */
    constructor(pool) {
        this.pool = pool;
        this.tableName = "userInfo";
    }

    async insert(userModel) {
        let [result, f] = await insertToDB(this.pool, this.tableName, userModel, null);
        return result.affectedRows;
    }

    /**
     * 
     * @param {number} accountid 
     * @returns {Promise<UserModel[]>} Return empty list if not found
     */
    async findByAccountId(accountid) {
        // let sql = `SELECT * FROM ${this.tableName} WHERE accountId = ?`;
        // var [rows, f] = await this.pool.execute(sql, [accountid]);
        // let rs = [];
        // for (let i = 0; i < rows.length; i++) {
        //     rs.push(rows[i]);
        // }

        // if (rs.length === 1) {
        //     const response = await axios.get(
        //         `${appConfig.authServerURL}/auth/nativeflutter/findbyid?accountId=${accountid}`
        //     );
        //     const userInfoFromAuthServer = {
        //         ...response.data.data[0],
        //         password: undefined,
        //         username: undefined,
        //     };
        //     rs[0] = { ...rs[0], ...userInfoFromAuthServer };
        // }

        const response = await axios.get(
            `${appConfig.authServerURL}/account/nativeflutter/findbyid?accountId=${accountid}`
        );

        const rs = [];
        for (let i = 0; i < response.data.data.length; i++) {
            const e = response.data.data[i];
            const row = {
                ...e,
                password: undefined,
                username: undefined,
                name: e.fullname,
                accountId: e.id,
            }
            
            rs.push(row);
        }

        return rs;
    }

    async updateLatestDelete(accountId, latestDelete) {
        let timeStamp = getUTCTimestamp();
        // let sql = `UPDATE ${this.tableName} SET latestDelete = ?, updateTime = ? WHERE accountId = ?`;
        // let [result, f] = await this.pool.execute(sql, [latestDelete, timeStamp, accountId]);
        // return result.affectedRows;
        const response = await axios.post(
            `${appConfig.authServerURL}/account/nativeflutter/update`,
            {
                key: accountId,
                latestDelete: latestDelete,
                updateTime: timeStamp,
            }
        );
        return response.data.result ? 1 : 0;
    }

    /**
     * Update name, image
     * @param {number} accountId Required
     * @param {String} name Required
     * @param {String} image Optional - Image full-path
     */
    async updateInfo(accountId, name, image) {
        console.log("UserInfo: Update accound with id = " + accountId);
        let data = {
            name: name
        };
        if (image !== undefined) {
            data["image"] = image;
        }
        let fields = Object.keys(data);
        let values = Object.values(data);

        let sql = `UPDATE ${this.tableName} SET ${fields.join("=?,") + "=?"} WHERE accountId=?`;

        console.log(sql);
        values.push(accountId);
        let [result] = await this.pool.execute(sql, values);
        return result.affectedRows;
    }
}