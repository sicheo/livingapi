import { injectable, inject} from "inversify";
import "reflect-metadata";
import { UserAuthenticate, UserConnection } from "../interfaces/interfaces";
import TYPES from "../types/types";

const Convergence = require("@convergence/convergence").Convergence
const WebSocket = require('isomorphic-ws')


@injectable()
export class AnonymousConnection implements UserConnection {
    private _url = ""

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
                .then((domain:any) => {
                    resolve(domain)
                })
                .catch((error: any) => {
                    reject(error)
                });
        })
    }

    public disconnect(domain:any) {
        return new Promise((resolve, reject) => {
            resolve(domain.dispose())
        })
    }
}

@injectable()
export class PasswordConnection implements UserConnection {
    private _url = ""
    private _user = ""
    private _password = ""

    constructor(url: string, user:string, password:string) {
        this._url = url
        this._user = user
        this._password = password
    }

    public connect() {
        return new Promise((resolve, reject) => {
            Convergence.connect(this._url,  this._user, this._password , {
                webSocket: {
                    factory: (u: any) => new WebSocket(u, { rejectUnauthorized: false }),
                    class: WebSocket
                }
            })
                .then((domain: any) => {
                    resolve(domain)
                })
                .catch((error: any) => {
                    reject(error)
                });
        })
    }

    public disconnect(domain:any) {
        return new Promise((resolve, reject) => {
            resolve(domain.dispose())
        })
    }
}

@injectable()
export class JwtConnection implements UserConnection {
    private _url = ""
    private _token: string | undefined
    private _auth: UserAuthenticate

    constructor(url: string,  @inject(TYPES.UserConnection) auth: UserAuthenticate) {
        this._url = url
        this._auth = auth
    }

    public connect(opts?:any) {
        return new Promise((resolve, reject) => {
            if (this._token == undefined || (opts && opts.renew)) {
                // AUTHENTICATE USER
                const aopts = { user: opts.user, password: opts.password }
                this._auth.authenticate(aopts)
                    .then((token: string) => {
                        this._token = token
                        Convergence.connectWithJwt(this._url, this._token, {
                            webSocket: {
                                factory: (u: any) => new WebSocket(u, { rejectUnauthorized: false }),
                                class: WebSocket
                            }
                        }).then((domain: any) => {
                                resolve(domain)
                            })
                            .catch((error: any) => {
                                reject(error)
                            });
                    })
                    .catch((error: string) => {
                        reject(error)
                    })
            }else {
                Convergence.connectWithJwt(this._url, this._token, {
                    webSocket: {
                        factory: (u: any) => new WebSocket(u, { rejectUnauthorized: false }),
                        class: WebSocket
                    }
                }).then((domain: any) => {
                        resolve(domain)
                    })
                    .catch((error: any) => {
                        reject(error)
                    });
            }
        })
    }

    public disconnect(domain:any) {
        return new Promise((resolve, reject) => {
            resolve(domain.dispose())
        })
    }
}