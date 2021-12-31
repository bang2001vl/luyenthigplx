export class AuthModel{
    /**
     * 
     * @param {{
     * id: number,
     * email: String,
     * password: ArrayBufferTypes,
     * }} args 
     */
    constructor(args){
        this.id = args.id;
        this.email = args.email;
        this.password = args.password;
    }

    static fromJSON(args){
        return new AuthModel({
            id: args["id"],
            email: args["email"],
            password: args["password"],
        });
    }
}