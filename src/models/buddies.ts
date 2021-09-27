
const sqlite3 = require('sqlite3');

export class LivingBuddiesModel {
    private db: any

    constructor(connectionstring: string) {
        this.db = new sqlite3.Database(connectionstring, (err: any) => {
            if (err) {
                console.error("Error opening database " + err.message);
            }
        })
    }

    public getBuddies(email:string) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM buddylist where user = ?`, email, (err: any, rows: any) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            })
        })
    }

    public addBuddy(item: any) {
        return new Promise((resolve, reject) => {
            this.db.all("INSERT INTO buddylist (user, buddy) VALUES (?,?)",
                [item.email, item.buddy], (err: any, rows: any) => {

                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                })
        })
    }

    public deleteBuddy(item: any) {
        return new Promise((resolve, reject) => {
            this.db.all("DELETE FROM buddylist WHERE (user = ? AND buddy = ?)",
                [item.email, item.buddy], (err: any, rows: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                })
        })
    }

}