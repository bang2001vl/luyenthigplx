'use strict';

import axios from "axios";
import { UserModel } from "../Class/Model";
import { appConfig } from "../config";

/**
 * @typedef {import("mysql2/promise").Pool} Pool} 
 * @typedef {import("../Class/Model").UserModel} UserModel}
 * @typedef {import("../Class/Model").AuthModel} AuthModel}
 */

export class AccountRepository{
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
     * @returns {Promise<AuthModel[]>} Return an empty list if not found
     */
    async findUserByAuth(email, password){
        //console.log(`Auth: Find email = ${email}, password = ${password}`);
        // var sql = `SELECT * FROM ${this.tableName} WHERE email=? AND password=?`;
        // var [rows, f] = await this.pool.execute(sql, [email, password]).catch((e)=>{
        //     console.log(JSON.stringify(e));
        //     return null;
        // });
        // var rs = [];
        // for(var i = 0; i< rows.length; i++){
        //     rs.push(rows[i]);
        //     console.log(JSON.stringify(rs[i]));
        // }
        // return rs;
        const response = await axios.get(
            `${appConfig.authServerURL}/account/nativeflutter/findbyauth?username=${email}&password=${password}`
        );
        return response.data.data;
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<AuthModel[]>} Return an empty list if not found
     */
    async findUserById(id){
        // var sql = `SELECT * FROM ${this.tableName} WHERE id=?`;
        // var [rows, f] = await this.pool.execute(sql, [id]);
        // var rs = [];
        // for(var i = 0; i< rows.length; i++){
        //     rs.push(rows[i]);
        // }
        // return rs;
        const response = await axios.get(
            `${appConfig.authServerURL}/account/nativeflutter/findbyid?accountId=${id}`
        );
        return response.data.result ? response.data.data : [];
    }
}