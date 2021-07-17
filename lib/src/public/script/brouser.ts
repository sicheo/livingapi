/*
 * This is the Browser User Digital Twin
 * He can jump, and hear and see and touch
 * just like you.
 * But he lives inside a browser
 * 
 * _id: Brouser identificator
 * _extid: Brouser external identificator
 * _token: jwt token
 */

import EventEmitter from "events";
import { inject } from "inversify";
import "reflect-metadata";
import { UserConnection} from "./interfaces/interfaces";
import TYPES from "./types/types";



class Brouser {
    private _id: string;
    private _extid: string
    private _token = "";
    private _connected = false
    private _status = "offline"
    private _evemitter: any
    private _connection: UserConnection
    private _domain: any


    constructor(id: string, @inject(TYPES.UserConnection) connection: UserConnection){
        this._id = id;
        this._extid = id;
        class MyEmitter extends EventEmitter { }
        this._evemitter = new MyEmitter()
        this._connection = connection

    }

    get id(): string {
        return this._id
    }

    get emitter() {
        return this._evemitter
    }

    get domain() {
        return this._domain
    }

    get token(): string {
        return this._token
    }

    set token(t: string) {
        this._token = t
        this._evemitter.emit("tokenchange")
    }

    get extid(): string {
        return this._extid
    }

    set extid(i: string) {
        this.extid = i
        this._evemitter.emit("extidchange")
    }

    get status(): string {
        return this._status
    }

    set status(s: string) {
        if (this._connected) {
            this.status = s
            this._domain.profile
            this._evemitter.emit("statuschange")
        }
    }

    set connection(conn: any) {
        this._connection = conn
    }

    isConnected(): boolean {
        return this._connected
    }


    connect(opts?:any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._connection.connect(opts)
                .then((d: any) => {
                    this._connected = true
                    this._domain = d
                    this._evemitter.emit("connected", this._domain)
                    resolve(d)
                })
                .catch((error: any) => {
                    this._connected = false
                    this._evemitter.emit("error", error)
                    reject(error)
                })
        })
    }

    disconnect(opts?:any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._connection.disconnect(this._domain)
                .then((res: any) => {
                    this._connected = false
                    this._evemitter.emit("disconnected", this._id)
                    resolve(res)
                })
                .catch((error: any) => {
                    this._connected = true
                    this._evemitter.emit("error", error)
                    reject(error)
                })
        })
    }


    Hello(): void {
        console.log(`Hello! I'm ${this.id}`);
    }
}

export { Brouser };