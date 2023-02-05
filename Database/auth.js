import axios from "axios";
import { UserModel } from "../Class/Model";
import { appConfig } from "../config";
import { sessionRepos, authRepos, userRepos } from "./mysqlController";

export class AuthRepos {

    /**
     * 
     * @param {String} email 
     * @param {Buffer} password 
     * @returns 
     */
    async login(email, password) {
        // Find accont has auth
        let access_token = await authRepos.loginByAuth(email, password);
        if (access_token != null) {
            // Login success
            // Get account data
            let l = await sessionRepos.checkSession(access_token);
            console.log("Login: Found auth", {authData: l});
            // Find userInfo
            let l2 = await userRepos.findByAccountId(l.account.id);
            let userInfo = null;
            if (l2.length === 1) {
                userInfo = l2[0];
            }
            else {
                // If userinfo not be created yet, then create new one
                await userRepos.insert(new UserModel({
                    ...l.userInfo,
                    latestDelete: 0,
                    updateTime: 0,
                }));
                userInfo = l.userInfo;
            }
            return {
                userInfo: userInfo,
                token: access_token,
            };
        }
        return null;
    }

    /**
     * 
     * @param {String} token 
     * @returns Null if check failed
     */
    async checkToken(token) {
        var l = await sessionRepos.checkSession(token);
        console.log("Check token: Found token ", {data: l});
        if (l != null) {
            var userInfo = await userRepos.findByAccountId(l.account.id);
            const session = l.session;
            // Passed
            return {
                userInfo: userInfo[0],
                session: session,
            };
        }
        return null;
    }
}