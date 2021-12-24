import { IdModel } from "./id.js";

export class TimeStampModel extends IdModel{
    /**
     * 
     * @param {{
     * id: number,
     * create_time: Date,
     * update_time: Date,
     * }} args
     */
    constructor(args){
        super(args);
        /**@type {Date} */
        this.create_time = args.create_time;
        /**@type {Date} */
        this.update_time = args.update_time;
    }
}