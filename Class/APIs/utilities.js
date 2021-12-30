
/**
 * @typedef {import("express").Response} Response
 */

/**
 * 
 * @param {Response} res 
 */
export function onAPIWrongProtocol(res){
    res.json({
        errorCode: 401,
        message: "Wrong protocol data",
    }).end();
}