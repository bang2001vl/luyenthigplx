export class SessionModel{
    /**
     * 
     * @param {{
     * token : String,
     * accountId : number,
     * createTime : Date,
     * lastTime : Date,
     * deviceInfo : String,
     * }} args 
     */
    constructor(args){
        this.token = args.token;
        this.accountId = args.accountId;
        this.createTime = args.createTime;
        this.lastTime = args.lastTime;
        this.deviceInfo = args.deviceInfo;
    }

    static fromJSON(json){
        return new SessionModel({
            token: json["token"],
            accountId: json["accountId"],
            createTime: json["createTime"],
            lastTime: json["lastTime"],
            deviceInfo: json["deviceInfo"],
        });
    }
}