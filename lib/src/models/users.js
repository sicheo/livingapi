"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivingUserModel = void 0;
const sqlite3 = require('sqlite3');
class LivingUserModel {
    constructor(connectionstring) {
        this.db = new sqlite3.Database(connectionstring, (err) => {
            if (err) {
                console.error("Error opening database " + err.message);
            }
        });
    }
    getUser(email) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM users where email = ?`, email, (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    }
    getUsers() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM users", [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
}
exports.LivingUserModel = LivingUserModel;
