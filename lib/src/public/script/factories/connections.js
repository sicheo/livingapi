"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtConnection = exports.PasswordConnection = exports.AnonymousConnection = void 0;
const Convergence = require("@convergence/convergence").Convergence;
const WebSocket = require('isomorphic-ws');
//@injectable()
class AnonymousConnection {
    constructor(url) {
        this._url = "";
        this._connected = false;
        this._authenticated = false;
        this._apiInterface = undefined;
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
                this._connected = true;
                resolve(domain);
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    disconnect(domain) {
        return new Promise((resolve, reject) => {
            this._connected = false;
            domain.dispose()
                .then(() => {
                resolve("disconnected");
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    isAuthenticated() {
        return this._authenticated;
    }
    isConnected() {
        return this._connected;
    }
    getApiInterface() {
        return this._apiInterface;
    }
}
exports.AnonymousConnection = AnonymousConnection;
//@injectable()
class PasswordConnection {
    constructor(url, user, password) {
        this._url = "";
        this._user = "";
        this._password = "";
        this._connected = false;
        this._authenticated = false;
        this._apiInterface = undefined;
        this._url = url;
        this._user = user;
        this._password = password;
    }
    connect() {
        return new Promise((resolve, reject) => {
            Convergence.connect(this._url, this._user, this._password, {
                webSocket: {
                    factory: (u) => new WebSocket(u),
                    class: WebSocket
                }
            })
                .then((domain) => {
                this._connected = true;
                this._authenticated = true;
                resolve(domain);
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    disconnect(domain) {
        return new Promise((resolve, reject) => {
            this._connected = false;
            this._authenticated = false;
            domain.dispose()
                .then(() => {
                resolve("disconnected");
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    isAuthenticated() {
        return this._authenticated;
    }
    isConnected() {
        return this._connected;
    }
    getApiInterface() {
        return this._apiInterface;
    }
}
exports.PasswordConnection = PasswordConnection;
//@injectable()
class JwtConnection {
    /*constructor(url: string,  @inject(TYPES.UserConnection) auth: UserAuthenticate) {
        this._url = url
        this._auth = auth
    }*/
    constructor(url, apiInterface) {
        this._url = "";
        this._connected = false;
        this._authenticated = false;
        this._url = url;
        this._apiInterface = apiInterface;
    }
    connect(opts) {
        return new Promise((resolve, reject) => {
            if (this._token == undefined || (opts && opts.renew)) {
                // AUTHENTICATE USER
                const aopts = { user: opts.user, password: opts.password };
                this._apiInterface.authenticate(aopts)
                    .then((token) => {
                    this._token = token;
                    this._authenticated = true;
                    Convergence.connectWithJwt(this._url, token, {
                        webSocket: {
                            factory: (u) => new WebSocket(u),
                            class: WebSocket
                        }
                    }).then((domain) => {
                        this._connected = true;
                        resolve(domain);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                })
                    .catch((error) => {
                    console.log("Auth Error: ");
                    reject(error);
                });
            }
            else {
                Convergence.connectWithJwt(this._url, this._token, {
                    webSocket: {
                        factory: (u) => new WebSocket(u),
                        class: WebSocket
                    }
                }).then((domain) => {
                    this._connected = true;
                    resolve(domain);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
        });
    }
    disconnect(domain) {
        console.log("DISCONNECT");
        return new Promise((resolve, reject) => {
            this._connected = false;
            this._authenticated = false;
            domain.dispose()
                .then(() => {
                resolve("disconnected");
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    isAuthenticated() {
        return this._authenticated;
    }
    isConnected() {
        return this._connected;
    }
    getApiInterface() {
        return this._apiInterface;
    }
}
exports.JwtConnection = JwtConnection;
