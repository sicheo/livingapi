"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthentication = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
require("reflect-metadata");
const axios = require('axios').default;
let JwtAuthentication = class JwtAuthentication {
    constructor(url) {
        this._url = url;
    }
    authenticate(opts) {
        return new Promise((resolve, reject) => {
            axios.post(this._url, {
                email: opts.user,
                password: opts.password
            }).then((response) => {
                this._token = response.data;
                resolve(response.data);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    }
};
JwtAuthentication = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [String])
], JwtAuthentication);
exports.JwtAuthentication = JwtAuthentication;
