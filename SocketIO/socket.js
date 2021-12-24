import { Server, Socket } from 'socket.io';
import {detroySessionData, getSessionData, saveSessionData} from './session';
import express from 'express';
import { createServer } from 'http';

const server = createServer();
const io = new Server(server);

/** @param {Socket} socket */
function onAuthorize(socket, data){
    // DENBUG
    onAuthSuccess(socket, data);
    return;

    // let token = data.auth_token;
    // let username = data.username;

    // if(token == undefined || username == undefined)
    // {
    //     socket.emit('resultAuthorize','Unauthorized');
    //     return;
    // }

    // //console.log('SOCKET.IO: Have access with token = ' + token + ' , username = ' + username);

    // jwt.verify(token, privateKey, (err, decoded)=>{
    //     if(err){
    //         console.log(err);
    //         socket.emit('resultAuthorize',{code:403, errorMessage:'Invalid token'});
    //         return;
    //     }
    //     // console.log('decoded = ' , JSON.stringify(decoded));
        
    //     console.log('SOCKET.IO: Authorized socket id = ' + socket.id);        
    //     socket.emit('resultAuthorized', {code: CODE_AUTH_SUCCESS});
    // });
}

/** @param {Socket} socket */
function onAuthSuccess(socket, data){
    // getSessionData(socket).isAuthorized = true;
    // getSessionData(socket).userID = data.userID;
    // saveSessionData(socket);
    
    socket.join("authoried", ()=>{
        console.log("SOCKET.IO: Join client " + socket.id + " to room /all");
    }); 
    socket.emit("authorized");
}

io.on("connection", (socket) => {
    console.log("Attemp from " + socket.id);
    socket.on("connect", ()=>{
        console.log('On connect from ' + socket.id);
    })

    socket.on('authorize', (data)=>{
        //console.log('on auth. data = ' + JSON.stringify(data));
        onAuthorize(socket, data)
    });

    setTimeout(function(){
        // If after 3s socket not auth yet, we will disconnect it
        if (!getSessionData(socket).isAuthorized) {
            console.log('Disconnect with reason timeout');
            socket.disconnect('unauthorized');
        }
    }, 3000);

    socket.on('disconnect', (reason)=>{
        console.log('SOCKET.IO: Disconnect client id = '+ socket.id + ' , with reason = ' + reason);
        detroySessionData(socket);
    });
});

/**
 * Start SocketIO server
 * @param {number} port 
 */
export function initSocketIO(port) {
    console.log("SocketIO: Listening on port " + port);
    server.listen(port);
}