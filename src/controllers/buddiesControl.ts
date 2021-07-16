import { LivingBuddiesModel } from "../models/buddies"


export class LivingBuddiesController {
    private buddymodel: LivingBuddiesModel | undefined

    constructor(connectionstring: string) {
        this.init(connectionstring)
    }

    private async init(connectionstring: string) {
        this.buddymodel = await new LivingBuddiesModel(connectionstring)
    }

    public getUserBuddies(email: string) {
        return new Promise((resolve, reject) => {
            this.buddymodel?.getBuddies(email)
                .then((rows: any) => {
                    resolve(rows)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    }
}