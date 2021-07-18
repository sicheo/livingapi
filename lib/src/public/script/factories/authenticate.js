"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthentication = void 0;
const axios = require('axios').default;
class JwtAuthentication {
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
}
exports.JwtAuthentication = JwtAuthentication;
