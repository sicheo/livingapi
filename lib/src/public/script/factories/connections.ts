//import { injectable, inject} from "inversify";
//import "reflect-metadata";
import { UserPersistenceApi, UserConnection } from "../interfaces/interfaces";
import TYPES from "../types/types";

const Convergence = require("@convergence/convergence").Convergence
const WebSocket = require('isomorphic-ws')


//@injectable()
export class AnonymousConnection implements UserConnection {
    private _url = ""
    private _connected = false
    private _authenticated = false;
    private _apiInterface:UserPersistenceApi|undefined = undefined;

    constructor(url: string) {
        this._url = url
    }

    public connect() {
        return new Promise((resolve, reject) => {
            Convergence.connectAnonymously(this._url, "Anonymous", {
                webSocket: {
                    factory: (u:any) => new WebSocket(u),
                    class: WebSocket
                }
            })
                .then((domain: any) => {
                    this._connected = true
                    resolve(domain)
                })
                .catch((error: any) => {
                    reject(error)
                });
        })
    }

    public disconnect(domain:any) {
        return new Promise((resolve, reject) => {
            this._connected = false
            domain.dispose()
                .then(() => {
                    resolve("disconnected")
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public isAuthenticated() {
        return this._authenticated
    }

    public isConnected() {
        return this._connected
    }

    public getApiInterface() {
        return this._apiInterface
    }
}

//@injectable()
export class PasswordConnection implements UserConnection {
    private _url = ""
    private _user = ""
    private _password = ""
    private _connected = false
    private _authenticated = false
    private _apiInterface: UserPersistenceApi | undefined = undefined;
    

    constructor(url: string, user:string, password:string) {
        this._url = url
        this._user = user
        this._password = password
    }

    public connect() {
        return new Promise((resolve, reject) => {
            Convergence.connect(this._url,  this._user, this._password , {
                webSocket: {
                    factory: (u: any) => new WebSocket(u),
                    class: WebSocket
                }
            })
                .then((domain: any) => {
                    this._connected = true
                    this._authenticated = true
                    resolve(domain)
                })
                .catch((error: any) => {
                    reject(error)
                });
        })
    }

    public disconnect(domain:any) {
        return new Promise((resolve, reject) => {
            this._connected = false
            this._authenticated = false
            domain.dispose()
                .then(() => {
                    resolve("disconnected")
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public isAuthenticated() {
        return this._authenticated
    }

    public isConnected() {
        return this._connected
    }

    public getApiInterface() {
        return this._apiInterface
    }
}

//@injectable()
export class JwtConnection implements UserConnection {
    private _url = ""
    private _token: string | undefined
    private _connected = false
    private _authenticated = false
    private _apiInterface: UserPersistenceApi;

    /*constructor(url: string,  @inject(TYPES.UserConnection) auth: UserAuthenticate) {
        this._url = url
        this._auth = auth
    }*/

    constructor(url: string, apiInterface: UserPersistenceApi) {
        this._url = url
        this._apiInterface = apiInterface
    }

    public connect(opts?: any) {
        return new Promise((resolve, reject) => {
            if (this._token == undefined || (opts && opts.renew)) {
                // AUTHENTICATE USER
                const aopts = { user: opts.user, password: opts.password }
                this._apiInterface.authenticate(aopts)
                    .then((token: string) => {
                        this._token = token
                        this._authenticated = true
                        Convergence.connectWithJwt(this._url, token, {
                            webSocket: {
                                factory: (u: any) => new WebSocket(u),
                                class: WebSocket
                            },
                            protocol: {
                                defaultRequestTimeout: 20000
                            }
                        }).then((domain: any) => {
                                this._connected = true
                                resolve(domain)
                            })
                            .catch((error: any) => {
                                reject(error)
                            });
                    })
                    .catch((error: string) => {
                        console.log("Auth Error: ")
                        reject(error)
                    })
            }else {
                Convergence.connectWithJwt(this._url, this._token, {
                    webSocket: {
                        factory: (u: any) => new WebSocket(u),
                        class: WebSocket
                    }
                }).then((domain: any) => {
                        this._connected = true
                        resolve(domain)
                    })
                    .catch((error: any) => {
                        reject(error)
                    });
            }
        })
    }

    public disconnect(domain: any) {
        return new Promise((resolve, reject) => {
            this._connected = false
            this._authenticated = false
            domain.dispose()
                .then(() => {
                    resolve("disconnected")
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public isAuthenticated() {
        return this._authenticated
    }

    public isConnected() {
        return this._connected
    }

    public getApiInterface() {
        return this._apiInterface
    }
}