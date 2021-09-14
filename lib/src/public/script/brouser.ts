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
import unknown from "isomorphic-ws";




class Brouser {
    /**
     * Summary: Brouser() user event digital twin.
     *
     * Description: connects. 
     *
     * @since      x.x.x
     * @deprecated x.x.x Use new_function_name() instead.
     * @access     private
     *
     * @constructs namespace.Class
     * @augments   Parent
     * @mixes      mixin
     *
     * @alias    realName
     * @memberof namespace
     *
     * @see   Function/class relied on
     * @link  URL
     * @fires Class#eventName
     *
     * @private string _id: user id
     * @private string _extid: external identifier
     * @private string  _status: user connection status ('offline','available','dnd', 'away')
     * @private EventEmitter _emitter: event emitter
     * @private UserConnection  _connection: user connection to the server(s)
     * @private UserPersistenceApi _apiInterface: interface to api server
     * @private ConvergenceDomain _domain: interface to convergence domain
     * @private ConvergenceSession _session: interface to convergence session
     * @private ConvergenceIdentity _identity: interface to convergence identity service
     * @private ConvergencePresence _presence: interface to convergence presence service
     * @private ConvergenceModels _models: interface to convergence model service
     * @private ConvergenceChat _chats: interface to convergence chat service
     */

    // EVENTS
    static EVT_GOTBUDDIES = "buddies"
    static EVT_CONNECTED = Conv.ConnectedEvent.NAME
    static EVT_SUBSCRIBED = "subscribed"
    static EVT_UNSUBSCRIBED = "unsubscribed"
    static EVT_UNSUBSCRIBEDALL = "unsubscribedall"
    static EVT_ERROR = Conv.ErrorEvent.NAME
    static EVT_DISCONNECTED = Conv.DisconnectedEvent.NAME
    static EVT_PRESENCESTATE = Conv.PresenceStateSetEvent.NAME
    static EVT_PRESENCESTATEREMOVED = Conv.PresenceStateRemovedEvent.NAME
    static EVT_PRESENCESTATECLEARED = Conv.PresenceStateClearedEvent.NAME
    static EVT_PRESENCEAVAILABILITYCHANGED = Conv.PresenceAvailabilityChangedEvent.NAME

    // ACTION TYPES
    static ACT_TYPE_PROJECT = "project"

    private _id: string
    private _extid: string
    private _status = "offline"
    private _evemitter: any
    private _connection: UserConnection
    private _apiInterface: UserPersistenceApi |undefined = undefined
    private _domain: any
    private _session: any
    private _identity: any
    private _presence: any
    private _subscriptions: any[] = []
    private _activities: any | undefined = undefined
    private _activity= { activity: undefined, partecipants:[] }
    private _models: any
    private _chats: any


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
     * @method getBuddies()
     * 
     * @returns string[]: array of userid
     */
    getBuddies(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this._apiInterface) {
                reject("API interface not defined")
            } else { 
            this._apiInterface.getBuddyList("/buddies/" + this._id)
                .then((response: any) => {
                    const list = response.map((item: any) => (item.buddy));
                    this._evemitter.emit(Brouser.EVT_GOTBUDDIES, list)
                    resolve(list)
                })
                .catch((error: any) => {
                    reject(error)
                })
            }
        })
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
            this._presence.setState("status", s)
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
     * @method connect(opts)
     *  connescts to Convergenge Server and Api Server
     * 
     * @param opts (optional): (user:username, password:passwd) - if not supplied try to reconnect
     * @returns Promise<any>: ConvergenceDomain
     */
    connect(opts?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const res = {
                user: this._id, evt: "connected", domain: "pippo", session: unknown
            }
            this._connection.connect(opts)
                .then((d: any) => {
                    this._domain = d
                    this.subscribeDomainEvents()
                    this._session = d.session()
                    res.domain = d._domainId
                    res.session = this._session.sessionId()
                    this._presence = d.presence()
                    this._identity = d.identity()
                    this._activities = d.activities()
                    this._models = d.models()
                    this._chats = d.chat()
                    this.status = "available"
                    this._evemitter.emit(Brouser.EVT_CONNECTED, res)
                    resolve('connected')
                })
                .catch((error: any) => {
                    //this._evemitter.emit("error", error)
                    reject(error)
                })
        })
    }

    /**
     * @method disconnect()
     * disconnects from Convergence Server
     *
     * @returns Promise<any>: after disconnection domain is no longer available
     */
    disconnect(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._connection.disconnect(this._domain)
                .then((res: any) => {
                    this._evemitter.emit("disconnected", this._id)
                    resolve(res)
                })
                .catch((error: any) => {
                    //this._evemitter.emit("error", error)
                    reject(error)
                })
        })
    }

    /**
     * @method subscribe(userlist)
     * subscribe to userlist events. Emits "subscribed"
     * control the online presence and availability of other users
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
                this._presence.subscribe(list)
                    .then((subscriptions: any) => {
                        subscriptions.forEach((subscription: any) => {
                            this._subscriptions.push(subscription)
                        });
                        this._evemitter.emit(Brouser.EVT_SUBSCRIBED, this._subscriptions)
                        this.subscribePresenceEvents(this._id)
                        this.subscribeBuddiesPresenceEvents()
                        resolve(this._subscriptions)
                    })
                    .catch((error: any) => {
                        //this._evemitter.emit("error", error)
                        reject(error);
                    });
            }
        })
    }

    /**
     * @method unsubscribe(username)
     * unsubscribe username. Emits "unsubscribed"
     *
     * @param username string: username to unsubscribe
     */
    unsubscribe(username: string) {
        const unsubscriptions = this._subscriptions.filter(subsc => subsc.user.username == username)
        for (let i = 0; i < unsubscriptions.length; i++) {
            this.unsubscribeBuddyEvents(this._subscriptions[i])
            unsubscriptions[i].unsubscribe()
        }
        this._evemitter.emit(Brouser.EVT_UNSUBSCRIBED, username)
    }

    /**
     * @method unsubscribeAll()
     * unsubscribe all subscribed users. Emits "unsubscribedall"
     *
     */
    unsubscribeAll() {
        for (let i = 0; i < this._subscriptions.length; i++) {
            this.unsubscribeBuddyEvents(this._subscriptions[i])
            this._subscriptions[i].unsubscribe()
        }
        this._subscriptions = []
        this._evemitter.emit(Brouser.EVT_UNSUBSCRIBEDALL)
    }

    /**
     * @method searchUser()
     * 
     * @param username string: username to search
     * @returns user: {username, firstName, lastName, displayName, email, isAnonimous}
     */
    searchUser(username:string) {
        return new Promise(async (resolve, reject) => {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected")
            }
            this._identity.user(username).then((user: any) => {
                resolve(user); // will be undefined if the user does not exist   
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    /**
     * @method searchUserByEmail()
     * 
     * @param email string: username to search
     * @returns user: {username, firstName, lastName, displayName, email, isAnonimous}
     */
    searchUserByEmal(email: string) {
        return new Promise(async (resolve, reject) => {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected")
            }
            this._identity.userByEmail(email).then((user: any) => {
                resolve(user); // will be undefined if the user does not exist   
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    /**
    * @method search()
    * 
    * @param query object: {fields:['firstname','lastName'], term: 'pippo', offset:0, limit:10, orderBy:{field:'lastName', ascending: true}}
    * @returns user array: [{username, firstName, lastName, displayName, email, isAnonimous}]
    */
    search(query: any) {
        return new Promise(async (resolve, reject) => {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected")
            }
            this._identity.search.then((users: any) => {
                resolve(users); // will be undefined if the user does not exist   
            }).catch((error: any) => {
                reject(error)
            })
        })
    }


    /**
     * @method joinactivity(userlist)
     * join activity or create if not exists
     * 
     * @param type string: activity type
     * @param id string: activity id
     * @returns joined activity
     */
    joinactivity(type: string, id: string) {
        const options = {
            autoCreate: {
                groupPermissions: {
                    "admins": ["join", "lurk", "set_state", "view_state", "manage", "remove"]
                }
            }
        }
        return new Promise(async (resolve, reject) => {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected")
            }
            this._activities.join(type, id, options).then((activity: any) => {
                this._activity.activity = activity
                resolve(activity)
            }).catch((error: any) => {
                reject(error)
            })
        })

    }

    /**
     * @method leaveactivity(leave)
     * leave activity 
     * 
     * @returns nothing
     */
    leaveactivity() {
        return new Promise(async (resolve, reject) => {
            if (!this._activity.activity != undefined) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected")
            }
            this._activities.leave().then(() => {
                this._activity.activity = undefined
                resolve("activity leaved")
            }).catch((error: any) => {
                reject(error)
            })
        })

    }

    /**
     * @method getpartecipants()
     * leave activity 
     * 
     * @returns partecipats array
     */
    getparticipants() {
        return new Promise(async (resolve, reject) => {
            if (!this._activity.activity != undefined) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected")
            }
            this._activities._participants = this._activities.activity.participants()
            resolve(this._activities._participants)
            
        })

    }

    /*
     * EVENT SUBSCRIPTION
     * 
     */
    private subscribeDomainEvents() {
        this._domain.on(Conv.DisconnectedEvent.NAME, () => {
            this._evemitter.emit(Brouser.EVT_DISCONNECTED, this._id)
        })

        this._domain.on(Conv.ErrorEvent.NAME, () => {
            this._evemitter.emit(Brouser.EVT_ERROR, this._id)
        })
    }

    private subscribePresenceEvents(user?: string) {
        const res = {
            user: user, evt: "", value: {}
        }
        this._domain.presence(user).on(Conv.PresenceStateSetEvent.NAME, (ret: any) => {
            if (ret.state.has("status")) {
                this._status = ret.state.get("status");
                res.value = this._status
                res.evt = "status_set";
            }
            this._evemitter.emit(Brouser.EVT_PRESENCESTATE, res)
        })
        this._domain.presence(user).on(Conv.PresenceStateRemovedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_PRESENCESTATEREMOVED, ret)
        })
        this._domain.presence(user).on(Conv.PresenceStateClearedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_PRESENCESTATECLEARED, ret)
        })
        this._domain.presence(user).on(Conv.PresenceAvailabilityChangedEvent.NAME, (ret: any) => {
            const res = {
                user: user, evt: "", value: {}
            }
            res.value = ret.available
            res.evt = "availability_change";
            this._evemitter.emit(Brouser.EVT_PRESENCEAVAILABILITYCHANGED, ret)
        })
    }

    private subscribeBuddyPresenceEvents(subscription : Conv.UserPresenceSubscription) {
            const res = {
                user: subscription.user.username, evt: "", value: {}
            }
            subscription.on(Conv.PresenceStateSetEvent.NAME, (ret: any) => {
                if (ret.state.has("status")) {
                    //this._status = ret.state.get("status");
                    res.evt = "status_set";
                    res.value = ret.state.get("status");
                }
                this._evemitter.emit(Brouser.EVT_PRESENCESTATE, res)
            })
            subscription.on(Conv.PresenceAvailabilityChangedEvent.NAME, (ret: any) => {
                const res = {
                    user: subscription.user.username, evt: "", value: {}
                }
                res.value = ret.available
                res.evt = "availability_change";

                this._evemitter.emit(Brouser.EVT_PRESENCEAVAILABILITYCHANGED, res)
            })
    }

    private subscribeBuddiesPresenceEvents() {
        this._subscriptions.forEach((subscription: any) => {
            this.subscribeBuddyPresenceEvents(subscription)
        })
    }

    private unsubscribeBuddyEvents(subscription: Conv.UserPresenceSubscription) {
        subscription.removeAllListeners()
    }

    private unsubscribeBuddiesEvents() {
        this._subscriptions.forEach((subscription: any) => {
            this.unsubscribeBuddyEvents(subscription)
        })
    }

}

export { Brouser};