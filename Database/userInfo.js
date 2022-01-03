'use strict';

import { UserModel } from "../Class/Model";
import { getUTCTimestamp } from "../Class/Model/timetamp";
import { insertToDB, updateToDB } from "./utilities";

/**
 * @typedef {import("mysql2/promise").Pool} Pool} 
 * @typedef {import("../Class/Model").UserModel} UserModel}
 */

export class UserInfoReposity{
    /**
     * 
     * @param {Pool} pool 
     */
    constructor(pool){
        this.pool = pool;
        this.tableName = "userInfo";
    }
    
    async insert(userModel){
        let [result, f] = await insertToDB(this.pool, this.tableName, userModel, null);
        return result.affectedRows;
    }

    /**
     * 
     * @param {number} accountid 
     * @returns {Promise<UserModel[]>} Return empty list if not found
     */
    async findByAccountId(accountid){
        let sql = `SELECT * FROM ${this.tableName} WHERE accountId = ?`;
        var [rows, f] = await this.pool.execute(sql, [accountid]);
        let rs = [];
        for(let i = 0; i< rows.length; i++){
            rs.push(rows[i]);
        }
        return rs;
    }

    async updateLatestDelete(accountId, latestDelete){
        let timeStamp = getUTCTimestamp();
        let sql = `UPDATE ${this.tableName} SET latestDelete = ?, updateTime = ? WHERE accountId = ?`;
        let [result, f] = await this.pool.execute(sql, [latestDelete, timeStamp, accountId]);
        return result.affectedRows;
    }

    /**
     * Update name, image
     * @param {number} accountId Required
     * @param {String} name Required
     * @param {String} image Optional - Image full-path
     */
    async updateInfo(accountId, name, image){
        console.log("UserInfo: Update accound with id = "+ accountId);
        let data = {
            name: name
        };
        if(image !== undefined){
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