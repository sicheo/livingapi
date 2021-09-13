"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivingBuddiesModel = void 0;
const sqlite3 = require('sqlite3');
class LivingBuddiesModel {
    constructor(connectionstring) {
        this.db = new sqlite3.Database(connectionstring, (err) => {
            if (err) {
                console.error("Error opening database " + err.message);
            }
        });
    }
    getBuddies(email) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM buddylist where user = ?`, email, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
    addBuddy(item) {
        return new Promise((resolve, reject) => {
            this.db.all("INSERT INTO buddylist (user, buddy) VALUES (?,?)", [item.email, item.buddy], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
    deleteBuddy(item) {
        return new Promise((resolve, reject) => {
            this.db.all("DELETE FROM buddylist WHERE (user = ? AND buddy = ?)", [item.email, item.buddy], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
}
exports.LivingBuddiesModel = LivingBuddiesModel;
