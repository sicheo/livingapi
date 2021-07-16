import { injectable} from "inversify";
import "reflect-metadata";
import { UserConnection } from "./interfaces";

const Convergence = require("@convergence/convergence").Convergence
const WebSocket = require('ws')


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
                    factory: (u:any) => new WebSocket(u, { rejectUnauthorized: false }),
                    class: WebSocket
                }
            })
                .then((domain:any) => {
                    console.log("AnonymousConnection Connection success");
                    resolve(domain)
                })
                .catch((error:any) => {
                    console.log("AnonymousConnection Connection failure", error);
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
                    console.log("PasswordConnection Connection success");
                    resolve(domain)
                })
                .catch((error: any) => {
                    console.log("PasswordConnection Connection failure", error);
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
    private _token = ""

    constructor(url: string, token: string) {
        this._url = url
        this._token = token
    }

    public connect() {
        return new Promise((resolve, reject) => {
            Convergence.connectWithJwt(this._url, this._token, {
                webSocket: {
                    factory: (u: any) => new WebSocket(u, { rejectUnauthorized: false }),
                    class: WebSocket
                }
            })
                .then((domain: any) => {
                    console.log("JWTConnection Connection success");
                    resolve(domain)
                })
                .catch((error: any) => {
                    console.log("JWTConnection Connection failure", error);
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