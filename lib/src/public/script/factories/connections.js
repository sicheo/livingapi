"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtConnection = exports.PasswordConnection = exports.AnonymousConnection = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = tslib_1.__importDefault(require("../types/types"));
const Convergence = require("@convergence/convergence").Convergence;
const WebSocket = require('isomorphic-ws');
let AnonymousConnection = class AnonymousConnection {
    constructor(url) {
        this._url = "";
        this._url = url;
    }
    connect() {
        return new Promise((resolve, reject) => {
            Convergence.connectAnonymously(this._url, "Anonymous", {
                webSocket: {
                    factory: (u) => new WebSocket(u),
                    class: WebSocket
                }
            })
                .then((domain) => {
                resolve(domain);
            })
                .catch((error) => {
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
                resolve(domain);
            })
                .catch((error) => {
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
    constructor(url, auth) {
        this._url = "";
        this._url = url;
        this._auth = auth;
    }
    connect(opts) {
        return new Promise((resolve, reject) => {
            if (this._token == undefined || (opts && opts.renew)) {
                // AUTHENTICATE USER
                const aopts = { user: opts.user, password: opts.password };
                this._auth.authenticate(aopts)
                    .then((token) => {
                    this._token = token;
                    Convergence.connectWithJwt(this._url, this._token, {
                        webSocket: {
                            factory: (u) => new WebSocket(u, { rejectUnauthorized: false }),
                            class: WebSocket
                        }
                    }).then((domain) => {
                        resolve(domain);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            else {
                Convergence.connectWithJwt(this._url, this._token, {
                    webSocket: {
                        factory: (u) => new WebSocket(u, { rejectUnauthorized: false }),
                        class: WebSocket
                    }
                }).then((domain) => {
                    resolve(domain);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
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
    tslib_1.__param(1, inversify_1.inject(types_1.default.UserConnection)),
    tslib_1.__metadata("design:paramtypes", [String, Object])
], JwtConnection);
exports.JwtConnection = JwtConnection;
