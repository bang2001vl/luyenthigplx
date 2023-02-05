'use strict';

import axios from "axios";
import { AuthModel, UserModel } from "../Class/Model";
import { appConfig } from "../config";
import { sessionRepos } from "./mysqlController";

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

    async loginByAuth(email, password){
        const resLogin = await axios.post(
            `${appConfig.authServerURL}/account/login/username`,
            {
                username: email,
                password: password
            }
        );
        if(resLogin.data == null){
            return null;
        }
        const access_token = resLogin.data.access_token;
        return access_token;
    }
}