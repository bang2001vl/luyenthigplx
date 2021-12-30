import express from 'express';
import * as http from "http";
import { authController } from '../../Database/mysqlController';
import { routeAuth } from './auth';

const app = express();
const serverHttp = http.createServer(app);

app.use(express.json())
app.use('/auth', routeAuth);

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

