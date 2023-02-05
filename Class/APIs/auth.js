import axios from "axios";
import express from "express";
import { appConfig } from "../../config";
import { authController, sessionRepos, userRepos } from "../../Database/mysqlController";
import { onAPIWrongProtocol } from "./utilities";

var route = express.Router();
//route.use(express.json());

route.post("/login", async (req, res) => {
    console.log("APIs: Login");
    console.log(JSON.stringify(req.body));
    if (typeof (req.body.email) !== 'string' || typeof (req.body.password) !== 'string') {
        onAPIWrongProtocol(res);
        return;
    }
    let email = req.body.email;
    let encodePassword = req.body.password;
    // eslint-disable-next-line no-undef
    //let password = Buffer.from(encodePassword, 'base64');
    let password = encodePassword.toString('base64');

    let data = await authController.login(email, password);
    if(data === null){
        res.json({
            errorCode: 402,
            message: "Wrong email or password",
        }).end();
        return;
    }

    let {userInfo, token} = data;
    res.json({
        userInfo: userInfo,
        token: token,
    }).end();
    return;
});

// Test-only
route.post("/logout", async (req, res) => {
    console.log("APIs: Logout");
    console.log(JSON.stringify(req.body));
    if (typeof (req.body.token) !== 'string') {
        onAPIWrongProtocol(res);
        return;
    }

    let token = req.body.token;
    try{
        await sessionRepos.deleteSessionByToken(token);
        res.json({
            result: "OK"
        }).end();
    }
    catch(ex){
        res.json({
            errorCode: 100,
            message: "Invalid token",
        }).end();
    }
});

export const routeAuth = route;