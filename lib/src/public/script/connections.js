"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtConnection = exports.PasswordConnection = exports.AnonymousConnection = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
require("reflect-metadata");
const Convergence = require("@convergence/convergence").Convergence;
const WebSocket = require('ws');
let AnonymousConnection = class AnonymousConnection {
    constructor(url) {
        this._url = "";
        this._url = url;
    }
    connect() {
        return new Promise((resolve, reject) => {
            Convergence.connectAnonymously(this._url, "Anonymous", {
                webSocket: {
                    factory: (u) => new WebSocket(u, { rejectUnauthorized: false }),
                    class: WebSocket
                }
            })
                .then((domain) => {
                console.log("AnonymousConnection Connection success");
                resolve(domain);
            })
                .catch((error) => {
                console.log("AnonymousConnection Connection failure", error);
                reject(error);
            });
        });
    }
    disconnect(domain) {
        return new Promise((resolve, reject) => {
            resolve(domain.dispose());
        });
    }
};
AnonymousConnection = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [String])
], AnonymousConnection);
exports.AnonymousConnection = AnonymousConnection;
let PasswordConnection = class PasswordConnection {
    constructor(url, user, password) {
        this._url = "";
        this._user = "";
        this._password = "";
        this._url = url;
        this._user = user;
        this._password = password;
    }
    connect() {
        return new Promise((resolve, reject) => {
            Convergence.connect(this._url, this._user, this._password, {
                webSocket: {
                    factory: (u) => new WebSocket(u, { rejectUnauthorized: false }),
                    class: WebSocket
                }
            })
                .then((domain) => {
                console.log("PasswordConnection Connection success");
                resolve(domain);
            })
                .catch((error) => {
                console.log("PasswordConnection Connection failure", error);
                reject(error);
            });
        });
    }
    disconnect(domain) {
        return new Promise((resolve, reject) => {
            resolve(domain.dispose());
        });
    }
};
PasswordConnection = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [String, String, String])
], PasswordConnection);
exports.PasswordConnection = PasswordConnection;
let JwtConnection = class JwtConnection {
    constructor(url, token) {
        this._url = "";
        this._token = "";
        this._url = url;
        this._token = token;
    }
    connect() {
        return new Promise((resolve, reject) => {
            Convergence.connectWithJwt(this._url, this._token, {
                webSocket: {
                    factory: (u) => new WebSocket(u, { rejectUnauthorized: false }),
                    class: WebSocket
                }
            })
                .then((domain) => {
                console.log("JWTConnection Connection success");
                resolve(domain);
            })
                .catch((error) => {
                console.log("JWTConnection Connection failure", error);
                reject(error);
            });
        });
    }
    disconnect(domain) {
        return new Promise((resolve, reject) => {
            resolve(domain.dispose());
        });
    }
};
JwtConnection = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [String, String])
], JwtConnection);
exports.JwtConnection = JwtConnection;
