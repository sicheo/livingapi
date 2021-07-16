"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brouser = void 0;
const tslib_1 = require("tslib");
const events_1 = tslib_1.__importDefault(require("events"));
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = tslib_1.__importDefault(require("./types"));
let Brouser = class Brouser {
    constructor(id, connection) {
        this._token = "";
        this._connected = false;
        this._status = "offline";
        this._id = id;
        this._extid = id;
        class MyEmitter extends events_1.default {
        }
        this._evemitter = new MyEmitter();
        this._connection = connection;
    }
    get id() {
        return this._id;
    }
    get emitter() {
        return this._evemitter;
    }
    get token() {
        return this._token;
    }
    set token(t) {
        this._token = t;
        this._evemitter.emit("tokenchange");
    }
    get extid() {
        return this._extid;
    }
    set extid(i) {
        this.extid = i;
        this._evemitter.emit("extidchange");
    }
    get status() {
        return this._status;
    }
    set status(s) {
        this.status = s;
        this._evemitter.emit("statuschange");
    }
    isConnected() {
        return this._connected;
    }
    connect(opts) {
        return new Promise((resolve, reject) => {
            this._connection.connect(opts)
                .then((res) => {
                this._connected = true;
                this._evemitter.emit("connected", this._id);
                resolve(res);
            })
                .catch((error) => {
                this._connected = false;
                reject(error);
            });
        });
    }
    disconnect(opts) {
        return new Promise((resolve, reject) => {
            this._connection.disconnect(opts)
                .then((res) => {
                this._connected = false;
                this._evemitter.emit("disconnected", this._id);
                resolve(res);
            })
                .catch((error) => {
                this._connected = true;
                reject(error);
            });
        });
    }
    Hello() {
        console.log(`Hello! I'm ${this.id}`);
    }
};
Brouser = tslib_1.__decorate([
    tslib_1.__param(1, inversify_1.inject(types_1.default.UserConnection)),
    tslib_1.__metadata("design:paramtypes", [String, Object])
], Brouser);
exports.Brouser = Brouser;
