import { IdModel } from "./id.js";

export class TimeStampModel {
    /**
     * 
     * @param {{
     * id: number,
     * create_time: number,
     * update_time: number,
     * sync_time: number,
     * }} args
     */
    constructor(args) {
        this.id = args.id;
        this.update_time = args.update_time;
        this.update_time = args.update_time;
        this.sync_time = args.sync_time;
    }

    static fromJSON(json) {
        this.id = json["id"];
        this.create_time = json["create_time"];
        this.sync_time = json["sync_time"];
        this.update_time = json["update_time"];
    }
}

/**
 * Current UTC time in milis from epoche
 * @returns {number} Current UTC time from epoche in milisecond
 */
export function getUTCTimestamp(){
    // Get curret UNIX timestamp
    var current = new Date().getTime();
    
    return current;
}