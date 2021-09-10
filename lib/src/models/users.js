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
    insertUser(user) {
        return new Promise((resolve, reject) => {
            const date = new Date();
            this.db.all("INSERT INTO users (firstname, lastname, primary_bio, secondary_bio, secondary_bio_language, usertype, username,email, email_verified_at, password, completed, active, is_admin, remember_token, created_at, updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [user.firstname, user.lastname, user.primary_bio, user.secondary_bio, user.secondary_bio_language, user.usertype, user.username, user.email, user.email_verified_at, user.password, user.completed, user.active, user.is_admin, user.remember_token, date.toISOString(), date.toISOString()], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
    deleteUser(email) {
        return new Promise((resolve, reject) => {
            this.db.all("DELETE FROM users WHERE email = ?", [email], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
    changePassword(email, password) {
        return new Promise((resolve, reject) => {
            this.db.all("UPDATE users SET password = ? WHERE email = ?", [password, email], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
    updateUser(user) {
        return new Promise((resolve, reject) => {
            const date = new Date();
            this.db.all("UPDATE users SET firstname = ?, lastname = ?, primary_bio = ?, secondary_bio = ?, secondary_bio_language = ?, usertype = ?, username = ?, completed = ?, active = ?, is_admin = ?, updated_at = ? WHERE email = ?", [user.firstname, user.lastname, user.primary_bio, user.secondary_bio, user.secondary_bio_language, user.usertype, user.username, user.completed, user.active, user.is_admin, date.toISOString(), user.email], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
}
exports.LivingUserModel = LivingUserModel;
