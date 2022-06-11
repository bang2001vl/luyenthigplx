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
        let l = await authRepos.findUserByAuth(email, password);
        if (l.length === 1) {
            let accountId = l[0].id;
            console.log("APIs: Found auth " + JSON.stringify(l[0]));
            // Find userInfo
            let l2 = await userRepos.findByAccountId(accountId);
            if (l2.length === 1) {
                let userInfo = l2[0];
                // if (userInfo.avatarURI) {
                //     const aaa = await axios.get(`${appConfig.authServerURL}/public/${userInfo.avatarURI}`);
                //     //console.log("Response: " + JSON.stringify(aaa));
                //     //console.log("ResponseData: " + JSON.stringify(aaa.data));
                //     userInfo.rawimage = aaa.data;
                // }
                // Insert token
                var token = await sessionRepos.insertSession(userInfo.accountId);
                console.log("APIs: Created session with token " + token);
                return {
                    userInfo: userInfo,
                    token: token,
                };
            }
        }
        return null;
    }

    /**
     * 
     * @param {String} token 
     * @returns Null if check failed
     */
    async checkToken(token) {
        var l = await sessionRepos.findSession(token);
        // console.log("Check token " + token);
        // var resAuth = await axios.get(
        //     `${appConfig.authServerURL}/auth/session/check`,
        //     {headers: {"token": token}}
        // );
        // var l = [resAuth.data.data];
        console.log("l = " + JSON.stringify(token));
        console.log("Check token: Found token " + JSON.stringify(l));
        if (l.length === 1) {
            let session = l[0];
            var userInfo = await userRepos.findByAccountId(Number(session.accountId));
            console.log("Check token: Found userInfo " + JSON.stringify(userInfo));
            if (userInfo.length < 1) {
                return null;
            }

            // Passed
            return {
                userInfo: userInfo[0],
                session: session,
            };
        }
        return null;
    }
}