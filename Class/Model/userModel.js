export class UserModel{
    /**
     * 
     * @param {{
     * id: number,
     * email: String,
     * password: ArrayBufferTypes,
     * name: String
     * }} args 
     */
    constructor(args){
        this.id = args.id;
        this.email = args.email;
        this.password = args.password;
        this.name = args.name;
    }

    static fromJSON(args){
        return new UserModel({
            id: args["id"],
            email: args["email"],
            password: args["password"],
            name: args["name"],
        });
    }
}