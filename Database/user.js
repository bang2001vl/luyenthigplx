'use strict';

import { UserModel } from "../Class/Model";

/**
 * @typedef {import("mysql2/promise").Pool} Pool} 
 * @typedef {import("../Class/Model").UserModel} UserModel}
 */

export class UserRepository{
    /**
     * 
     * @param {Pool} pool 
     */
    constructor(pool){
        this.pool = pool;
        this.tableName = "account";
    }

    /**
     * 
     * @param {String} email 
     * @param {Buffer} password 
     * @returns Return an empty list if not found
     */
    async findUserByAuth(email, password){
        //console.log(`Auth: Find email = ${email}, password = ${password}`);
        var sql = `SELECT * FROM ${this.tableName} WHERE email=? AND password=?`;
        var [rows, f] = await this.pool.execute(sql, [email, password]).catch((e)=>{
            console.log(JSON.stringify(e));
            return null;
        });
        var rs = [];
        for(var i = 0; i< rows.length; i++){
            rs.push(UserModel.fromJSON(rows[i]));
            console.log(JSON.stringify(rs[i]));
        }
        return rs;
    }

    /**
     * 
     * @param {number} id 
     * @returns Return an empty list if not found
     */
    async findUserById(id){
        var sql = `SELECT * FROM ${this.tableName} WHERE id=?`;
        var [rows, f] = await this.pool.execute(sql, [id]);
        var rs = [];
        for(var i = 0; i< rows.length; i++){
            rs.push(UserModel.fromJSON(rows[i]));
        }
        return rs;
    }
}