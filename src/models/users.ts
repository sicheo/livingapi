// To compile from source and include json extension:
// export NODE_SQLITE3_JSON1 = yes prior to doing npm install sqlite3--build - from - source=sqlite3
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

    public insertUser(user:any) {
        return new Promise((resolve, reject) => {
            const date = new Date()
            this.db.all("INSERT INTO users (firstname, lastname, primary_bio, secondary_bio, secondary_bio_language, usertype, username,email, email_verified_at, password, completed, active, is_admin, remember_token, created_at, updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [user.firstname, user.lastname, user.primary_bio, user.secondary_bio, user.secondary_bio_language, user.usertype, user.username, user.email, user.email_verified_at, user.password, user.completed, user.active, user.is_admin, user.remember_token, date.toISOString(), date.toISOString() ], (err: any, rows: any) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            })
        })
    }

    public deleteUser(email: string) {
        return new Promise((resolve, reject) => {
            this.db.all("DELETE FROM users WHERE email = ?",
                [email], (err: any, rows: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                })
        })
    }

    public changePassword(email:string,password: string) {
        return new Promise((resolve, reject) => {
            this.db.all("UPDATE users SET password = ? WHERE email = ?",
                [password, email], (err: any, rows: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                })
        })
    }

    public updateUser(user: any) {
        return new Promise((resolve, reject) => {
            const date = new Date()
            this.db.all("UPDATE users SET firstname = ?, lastname = ?, primary_bio = ?, secondary_bio = ?, secondary_bio_language = ?, usertype = ?, username = ?, completed = ?, active = ?, is_admin = ?, updated_at = ? WHERE email = ?",
                [user.firstname, user.lastname, user.primary_bio, user.secondary_bio, user.secondary_bio_language, user.usertype, user.username, user.completed, user.active, user.is_admin, date.toISOString(),user.email],
                (err: any, rows: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                })
        })
    }

    public updateUserField(email: string, field: string, value: any) {
        const stmt = "UPDATE users SET " + field +"= ?  WHERE email = ?"
        return new Promise((resolve, reject) => {
            this.db.all(stmt,
                [value,email],
                (err: any, rows: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                })
        })
    }
}