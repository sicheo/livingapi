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
import { UserConnection, UserPersistenceApi } from "./interfaces/interfaces";

import * as Conv from "@convergence/convergence"



/**
 * Class Brouser
 * 
 * Manage the user realtime status inside the browser app 
 * 
 * @private string _id: user id
 * @private string _extid: external identifier
 * @private string  _status: user connection status ('offline','available','dnd', 'away')
 * @private EventEmitter _emitter: event emitter
 * @private UserConnection  _connection: user connection to the server(s)
 * @private UserPersistenceApi _apiInterface: interface to api server
 * @private ConvergenceDomain _domain: interface to convergence domain
 * @private ConvergenceSession _session: interface to convergence session
 * */
class Brouser {
    private _id: string
    private _extid: string
    private _status = "offline"
    private _evemitter: any
    private _connection: UserConnection
    private _apiInterface: UserPersistenceApi |undefined = undefined
    private _domain: any
    private _session: any
    private _presence: any
    private _subscriptions:any[] = []


    /**
     * @constructor
     *
     * @param id string: user id
     * @param connection UserConnection: connection to server(s)
     */
    constructor(id: string, connection: UserConnection) {
        this._id = id;
        this._extid = id;
        class MyEmitter extends EventEmitter { }
        this._evemitter = new MyEmitter()
        this._connection = connection
        this._apiInterface = connection.getApiInterface()

    }

    /**
     * @method id() getter
     * 
     * @returns string: _id
     */
    get id(): string {
        return this._id
    }

    /**
     * @method emitter() getter
     *  
     * Events:
     *    "connecting": emitted during connection to Convergence Server
     *    "authenticating": emittedduring authetication to Convergence Server
     *    "connected": emitted on successful connection to Convergence Server
     *    "connection_failed": emitted on failed connection to Convergence Server
     *    "interrupted": emmitted on interrupted connection to Convergence Server
     *    "disconnected": emitted on disconneftion from Convergence Server
     *    "error": emitted on error
     * @returns EventEmitter: _emitter
     */
    get emitter(): EventEmitter {
        return this._evemitter
    }

    /**
     * @method domain() getter
     *
     * @returns ConvergenceDomain: _domain or undefined
     */
    get domain() {
        return this._domain
    }

    /**
     * @method exid() getter
     *
     * @returns string: _extid
     */
    get extid(): string {
        return this._extid
    }

    /**
     * @method exid() setter
     *
     * @param i string : new ext id
     */
    set extid(i: string) {
        this.extid = i
        //this._evemitter.emit("extidchange")
    }

    /**
     * @method status() getter
     *
     * @returns string: _status
     */
    get status(): string {
        return this._status
    }

    /**
     * @method status() setter
     *
     * @param s string : new status ('offline','available','dnd', 'away')
     */
    set status(s: string) {
        if (this._domain) {
            this._domain.presence().setState("status", s)
            //this._evemitter.emit("statuschange",this._status)
        } else {
            //this._evemitter.emit("error", "_domain null")
        }
    }

    /*set connection(conn: any) {
        this._connection = conn
    }*/

    /**
     * @method isConnected()
     *
     * @returns boolean: true if user is connected to server(s)
     */
    isConnected(): boolean {
        if (this._session)
            return this._session.isConnected()
        else
            return false
    }

    /**
     * @method isAuthenticated()
     *
     * @returns boolean: true if user is authenticated
     */
    isAuthenticated(): boolean {
        if (this._session)
            return this._session.isAuthenticated()
        else
            return false
    }

    /**
     * @method getSessionId()
     *
     * @returns string: session id
     */
    getSessionId(): string {
        if (this._session)
            return this._session.sessionId()
        else
            return ""
    }

    /**
     * @method connect()
     *
     * @param opts (optional): {user:username, password:passwd} - if not supplied try to reconnect
     * @returns Promise<any>: ConvergenceDomain
     */
    connect(opts?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._connection.connect(opts)
                .then((d: any) => {
                    this._domain = d
                    this.subscribeDomainEvents()
                    this._session = d.session()
                    this._evemitter.emit("connected", this._domain)
                    this.status = "available"
                    resolve(d)
                })
                .catch((error: any) => {
                    //this._evemitter.emit("error", error)
                    reject(error)
                })
        })
    }

    /**
     * @method disconnect()
     *
     * @returns Promise<any>: after disconnection domain is no longer available
     */
    disconnect(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._connection.disconnect(this._domain)
                .then((res: any) => {
                    //this._evemitter.emit("disconnected", this._id)
                    resolve(res)
                })
                .catch((error: any) => {
                    //this._evemitter.emit("error", error)
                    reject(error)
                })
        })
    }

    /**
     * @method subscribe()
     *
     * @param userlist (optional): ["user1", "user2",...] - if not supplied get userlist from Api erver
     * @returns subscriptions: array of subcription
     */
    subscribe(userlist?:string[]) {
        return new Promise(async (resolve, reject) => {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected")
            }
            let list = userlist
            if (userlist == undefined && this._apiInterface != undefined) {
                try {
                    const response = await this._apiInterface.getBuddyList("/buddies/" + this._id)
                    list = response.map((item: any) => (item.buddy));
                } catch (error) {
                    reject(error)
                }
            }
            if (this._domain) {
                this._domain.presence().subscribe(list)
                    .then((subscriptions: any) => {
                        subscriptions.forEach((subscription: any) => {
                            this._subscriptions.push(subscription)
                        });
                        this._evemitter.emit("subscribed", this._subscriptions)
                        this.subscribePresenceEvents(this._id)
                        this.subscribeBuddyPresenceEvents()
                        resolve(this._subscriptions)
                    })
                    .catch((error: any) => {
                        //this._evemitter.emit("error", error)
                        reject(error);
                    });
            }
        })
    }

    unsubscribe(username: string) {
        const unsubscriptions = this._subscriptions.filter(subsc => subsc.user.username == username)
        for (let i = 0; i < unsubscriptions.length; i++)
            unsubscriptions[i].unsubscribe()
        this._evemitter.emit("unsubscribed", username)
    }


    unsubscribeAll() {
        for (let i = 0; i < this._subscriptions.length; i++)
            this._subscriptions[i].unsubscribe()
        this._subscriptions = []
        this._evemitter.emit("unsubscribedall")
    }

   

    private subscribeDomainEvents() {
        this._domain.on(Conv.ConnectedEvent.NAME, () => {
            this._evemitter.emit(Conv.ConnectedEvent.NAME, this._id)
        })
        this._domain.on(Conv.DisconnectedEvent.NAME, () => {
            this._evemitter.emit(Conv.DisconnectedEvent.NAME, this._id)
        })
        this._domain.on(Conv.ErrorEvent.NAME, () => {
            this._evemitter.emit(Conv.ErrorEvent.NAME, this._id)
        })
    }

    private subscribePresenceEvents(user?:string) {
        this._domain.presence(user).on(Conv.PresenceStateSetEvent.NAME, (ret: any) => {
            if (ret.state.has("status")) {
                this._status = ret.state.get("status");
            }
            this._evemitter.emit(Conv.PresenceStateSetEvent.NAME, this.status)
        })
        this._domain.presence(user).on(Conv.PresenceStateRemovedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Conv.PresenceStateRemovedEvent.NAME, ret)
        })
        this._domain.presence(user).on(Conv.PresenceStateClearedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Conv.PresenceStateClearedEvent.NAME, ret)
        })
        this._domain.presence(user).on(Conv.PresenceAvailabilityChangedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Conv.PresenceAvailabilityChangedEvent.NAME, ret)
        })
    }

    private subscribeBuddyPresenceEvents() {
        this._subscriptions.forEach((subscription: any) => {
            subscription.on(Conv.PresenceStateSetEvent.NAME, (ret: any) => {
                if (ret.state.has("status")) {
                    this._status = ret.state.get("status");
                }
                this._evemitter.emit(Conv.PresenceStateSetEvent.NAME, this.status)
            })
        })
    }
    

}

export { Brouser};