"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apisrv_1 = require("../apisrv");
const main = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const apiserver = yield new apisrv_1.ApiServer(["convergence", "mock"]);
        apiserver.start();
    });
};
main();
