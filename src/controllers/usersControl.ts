import { LivingUserModel } from "../models/users";

export class LivingUserController {
    private usermodel: LivingUserModel | undefined

    constructor(connectionstring: string) {
        this.init(connectionstring)
    }

    private async init(connectionstring: string) {
        this.usermodel = await new LivingUserModel(connectionstring)
    }

    public getUserLogin(email: string, password:string) {
        const usrpass = { user: "", password: "" }
        return new Promise((resolve, reject) => {
            this.usermodel?.getUser(email)
                .then((row: any) => {
                    //console.log("getUserLogin")
                    if (row && row.password == password) {
                        usrpass.user = row.email
                        usrpass.password = row.password
                        resolve(usrpass)
                    } else {
                        //console.log("getUserLogin")
                        reject(usrpass)
                    }
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    }
}