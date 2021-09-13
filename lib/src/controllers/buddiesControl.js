"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivingBuddiesController = void 0;
const tslib_1 = require("tslib");
const buddies_1 = require("../models/buddies");
class LivingBuddiesController {
    constructor(connectionstring) {
        this.init(connectionstring);
    }
    init(connectionstring) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.buddymodel = yield new buddies_1.LivingBuddiesModel(connectionstring);
        });
    }
    getUserBuddies(email) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.buddymodel) === null || _a === void 0 ? void 0 : _a.getBuddies(email).then((rows) => {
                resolve(rows);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    addBuddy(item) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.buddymodel) === null || _a === void 0 ? void 0 : _a.addBuddy(item).then((rows) => {
                resolve(rows);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    deleteBuddy(item) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.buddymodel) === null || _a === void 0 ? void 0 : _a.deleteBuddy(item).then((rows) => {
                resolve(rows);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
exports.LivingBuddiesController = LivingBuddiesController;
