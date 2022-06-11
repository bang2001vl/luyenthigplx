import express from 'express';
import * as http from "http";
import { authController } from '../../Database/mysqlController';
import { routeAuth } from './auth';
import { appConfig } from '../../config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import expressHttpProxy from 'express-http-proxy';

const app = express();
const serverHttp = http.createServer(app);
console.log(`${appConfig.authServerURL}/public`);

app.use(express.json());
app.use('/auth', routeAuth);
app.use('/authserver', expressHttpProxy(appConfig.authServerURL));

/**
 * Start api server
 */
export function initServer() {
    // serverHttp.listen(80, () => {
    //     console.log("HttpServer: Listening on port 80");
    // });
    serverHttp.listen(8080, () => {
        console.log("HttpServer: Listening on port 8080");
    });
}

