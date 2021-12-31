export class UserModel{
    /**
     * 
     * @param {{
     * accountId: number,
     * name: String,
     * image: String,
     * latestDelete: number,
     * updateTime: number,
     * }} args 
     */
    constructor(args){
        this.accountId = args.accountId;
        this.name = args.name;
        this.image = args.image;
        this.latestDelete = args.latestDelete;
        this.updateTime = args.updateTime;
    }

    static fromJSON(args){
        return new UserModel({
            accountId: args["accountId"],
            name: args["name"],
            image: args["image"],
            latestDelete: args["latestDelete"],
            updateTime: args["updateTime"],
        });
    }
}