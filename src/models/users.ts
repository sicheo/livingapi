
const sqlite3 = require('sqlite3');

export class LivingUserModel {
    private db: any

    constructor(connectionstring: string) {
        this.db = new sqlite3.Database(connectionstring, (err: any) => {
            if (err) {
                console.error("Error opening database " + err.message);
            }
        })
    }

    public getUser(email: string) {
        return new Promise( (resolve, reject) => {
            this.db.get(`SELECT * FROM users where email = ?`, email, (err: any, row: any) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            })
        })
    }

    public getUsers() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM users", [], (err: any, rows: any) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            })
        })
    }

}