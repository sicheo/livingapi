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
const Convergence = require("@convergence/convergence").Convergence;
class Brouser {
    constructor(id, connection) {
        this._token = "";
        this._connected = false;
        this._status = "offline";
        this._subscriptions = [];
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
    get domain() {
        return this._domain;
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
        if (this._connected) {
            this.status = s;
            this._domain.profile;
            this._evemitter.emit("statuschange");
        }
    }
    set connection(conn) {
        this._connection = conn;
    }
    isConnected() {
        return this._connected;
    }
    connect(opts) {
        return new Promise((resolve, reject) => {
            this._connection.connect(opts)
                .then((d) => {
                this._connected = true;
                this._domain = d;
                this._evemitter.emit("connected", this._domain);
                resolve(d);
            })
                .catch((error) => {
                this._connected = false;
                this._evemitter.emit("error", error);
                reject(error);
            });
        });
    }
    disconnect(opts) {
        return new Promise((resolve, reject) => {
            this._connection.disconnect(this._domain)
                .then((res) => {
                this._connected = false;
                this._evemitter.emit("disconnected", this._id);
                resolve(res);
            })
                .catch((error) => {
                this._connected = true;
                this._evemitter.emit("error", error);
                reject(error);
            });
        });
    }
    subscribe(userlist) {
        return new Promise((resolve, reject) => {
            if (!this.isConnected()) {
                this._evemitter.emit("error", "Not connected");
                reject("Not connected");
            }
            if (this._domain) {
                this._domain.presence().subscribe(userlist)
                    .then((subscriptions) => {
                    for (let i = 0; i < subscriptions.length; i++) {
                        this._subscriptions.push(subscriptions[i]);
                        this._domain.presence().on("state_set", (evt) => {
                            if (evt.state.has("status")) {
                                this.status = evt.state.get("status");
                            }
                        });
                    }
                    this._evemitter.emit("subscribed", this._subscriptions);
                    resolve(this._subscriptions);
                })
                    .catch((error) => {
                    this._evemitter.emit("error", error);
                    reject(error);
                });
            }
        });
    }
    unsubscribe(username) {
        const unsubscriptions = this._subscriptions.filter(subsc => subsc.user.username == username);
        for (let i = 0; i < unsubscriptions.length; i++)
            unsubscriptions[i].unsubscribe();
        this._evemitter.emit("unsubscribed", username);
    }
}
exports.Brouser = Brouser;
