"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivingUserController = void 0;
const tslib_1 = require("tslib");
const users_1 = require("../models/users");
class LivingUserController {
    constructor(connectionstring) {
        this.init(connectionstring);
    }
    init(connectionstring) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.usermodel = yield new users_1.LivingUserModel(connectionstring);
        });
    }
    getUserLogin(email, password) {
        const usrpass = { user: "", password: "", isAdmin: 0 };
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.usermodel) === null || _a === void 0 ? void 0 : _a.getUser(email).then((row) => {
                //console.log("getUserLogin")
                if (row && row.password == password) {
                    usrpass.user = row.email;
                    usrpass.password = row.password;
                    usrpass.isAdmin = row.is_admin;
                    resolve(usrpass);
                }
                else {
                    //console.log("getUserLogin")
                    reject(usrpass);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
    insertUser(user) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.usermodel) === null || _a === void 0 ? void 0 : _a.insertUser(user).then((row) => {
                resolve(row);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    deletetUser(email) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.usermodel) === null || _a === void 0 ? void 0 : _a.deleteUser(email).then((row) => {
                resolve(row);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    getUser(email) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.usermodel) === null || _a === void 0 ? void 0 : _a.getUser(email).then((row) => {
                resolve(row);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    changePassword(email, password) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.usermodel) === null || _a === void 0 ? void 0 : _a.changePassword(email, password).then((row) => {
                resolve(row);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    updateUser(user) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.usermodel) === null || _a === void 0 ? void 0 : _a.updateUser(user).then((row) => {
                resolve(row);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    updateUserField(email, field, value) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.usermodel) === null || _a === void 0 ? void 0 : _a.updateUserField(email, field, value).then((row) => {
                resolve(row);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
exports.LivingUserController = LivingUserController;
