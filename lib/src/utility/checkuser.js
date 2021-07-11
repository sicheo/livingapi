"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const usersControl_1 = require("../controllers/usersControl");
const main = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log("***** TEST USERS ***********");
        const path = require("path");
        const confpath = path.join(__dirname, "/../data/livingdb.db");
        console.log(confpath);
        const luser = yield new usersControl_1.LivingUserController(confpath);
        luser.getUserLogin("giulio.stumpo@gmail.com", "passwordi")
            .then((data) => {
            console.log(data);
        })
            .catch((err) => {
            console.log(err);
        });
    });
};
main();
