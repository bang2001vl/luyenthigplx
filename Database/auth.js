import { UserModel } from "../Class/Model";
import { sessionRepos, userRepos } from "./mysqlController";

export class AuthRepos {
    
    /**
     * 
     * @param {String} email 
     * @param {Buffer} password 
     * @returns 
     */
    async login(email, password) {
        let l = await userRepos.findUserByAuth(email, password);
        if (l.length == 1) {
            let user = l[0];
            var token = await sessionRepos.insertSession(user);
            return {
                user: user,
                token: token,
            };
        }
        else {
            return null;
        }
    }

    /**
     * 
     * @param {String} token 
     * @returns Null if check failed
     */
    async checkToken(token) {
        var l = await sessionRepos.findSession(token);
        if (l.length == 1) {
            let session = l[0];
            var user = await userRepos.findUserById(session.accountId);
            if (user.length < 1) {
                return null;
            }

            // Passed
            return {
                user: user[0],
                session: session,
            };
        }
        else {
            return null;
        }
    }
}