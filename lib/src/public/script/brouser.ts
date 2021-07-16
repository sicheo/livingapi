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
import { UserConnection } from "./interfaces";
import TYPES from "./types";



class Brouser {
    private _id: string;
    private _extid: string
    private _token = "";
    private _connected = false
    private _status = "offline"
    private _evemitter: any
    private _connection: UserConnection


    constructor(id: string, @inject(TYPES.UserConnection) connection: UserConnection) {
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
        this.status = s
        this._evemitter.emit("statuschange")
    }

    isConnected(): boolean {
        return this._connected
    }

    connect(opts?:any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._connection.connect(opts)
                .then((res: any) => {
                    this._connected = true
                    this._evemitter.emit("connected", this._id)
                    resolve(res)
                })
                .catch((error: any) => {
                    this._connected = false
                    reject(error)
                })
        })
    }

    disconnect(opts?:any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._connection.disconnect(opts)
                .then((res: any) => {
                    this._connected = false
                    this._evemitter.emit("disconnected", this._id)
                    resolve(res)
                })
                .catch((error: any) => {
                    this._connected = true
                    reject(error)
                })
        })
    }

    Hello(): void {
        console.log(`Hello! I'm ${this.id}`);
    }
}

export { Brouser };