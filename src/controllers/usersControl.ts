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
        const usrpass = { user: "", password: "", isAdmin: 0 }
        return new Promise((resolve, reject) => {
            this.usermodel?.getUser(email)
                .then((row: any) => {
                    //console.log("getUserLogin")
                    if (row && row.password == password) {
                        usrpass.user = row.email
                        usrpass.password = row.password
                        usrpass.isAdmin = row.is_admin
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

    public insertUser(user: any) {
        return new Promise((resolve, reject) => {
            this.usermodel?.insertUser(user)
                .then((row: any) => {
                    resolve(row)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    }

    public deletetUser(email: string) {
        return new Promise((resolve, reject) => {
            this.usermodel?.deleteUser(email)
                .then((row: any) => {
                    resolve(row)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    }

    public changePassword(email: string, password:string) {
        return new Promise((resolve, reject) => {
            this.usermodel?.changePassword(email, password)
                .then((row: any) => {
                    resolve(row)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    }
}