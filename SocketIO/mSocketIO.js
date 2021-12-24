const { Socket } = require("socket.io");
const { SocketAuthData } = require("../Class/APIs/socketData");
const { wlog } = require("../_helper/helper");

const CODE_AUTH_SUCCESS = 200;

/**
 * 
 * @param {Socket} socket 
 * @returns {SessionData} Session data of the socket
 */
 function getSessionData(socket){
    return socket.handshake.session;
}

function saveSessionData(socket){
    socket.handshake.session.save();
}

function detroySessionData(socket){
    socket.handshake.session = null;
}

/**
 * 
 * @param {Socket} socket 
 * @param {SocketAuthData} data 
 * @returns {void}
 */
function onAuthorize(socket, data){
    let token = data.auth_token;
    let username = data.username;

    if(token == undefined || username == undefined)
    {
        socket.emit('resultAuthorize','Unauthorized');
        return;
    }

    wlog('SOCKET.IO: Have access with token = ' + token + ' , username = ' + username);

    

    jwt.verify(token, privateKey, (err, decoded)=>{
        if(err){
            console.log(err);
            socket.emit('resultAuthorize',{code:403, errorMessage:'Invalid token'});
            return;
        }
        // console.log('decoded = ' , JSON.stringify(decoded));
        
        wlog('SOCKET.IO: Authorized socket id = ' + socket.id);        
        socket.emit('resultAuthorized', {code: CODE_AUTH_SUCCESS});
    });
}

function onAuthSuccess(socket){
    getSessionData(socket).isAuthorized = true;
    getSessionData(socket).userID = decoded.userID;
    saveSessionData(socket);
    
    socket.join("all", ()=>{
        console.log("SOCKET.IO: Join client " + socket.id + " to room /all");
        
    }); 
}

function onCompleteExam(socket, data){

}

/**
 * 
 * @param {Socket} socket 
 */
function onConnection(socket){
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

    socket.on('resultAuthorized', (data)=>{
        if(data.code == CODE_AUTH_SUCCESS){
            onAuthSuccess(socket);
        }
    });
}

module.exports = {
    onAuthorize,
    onConnection,
}