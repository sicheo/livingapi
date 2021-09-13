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
const Conv = tslib_1.__importStar(require("@convergence/convergence"));
class Brouser {
    /**
     * @constructor
     *
     * @param id string: user id
     * @param connection UserConnection: connection to server(s)
     */
    constructor(id, connection) {
        this._status = "offline";
        this._apiInterface = undefined;
        this._subscriptions = [];
        this._activities = undefined;
        this._activity = { activity: undefined, partecipants: [] };
        this._id = id;
        this._extid = id;
        class MyEmitter extends events_1.default {
        }
        this._evemitter = new MyEmitter();
        this._connection = connection;
        this._apiInterface = connection.getApiInterface();
    }
    /**
     * @method id() getter
     *
     * @returns string: _id
     */
    get id() {
        return this._id;
    }
    /**
     * @method getBuddies()
     *
     * @returns string[]: array of userid
     */
    getBuddies() {
        return new Promise((resolve, reject) => {
            if (!this._apiInterface) {
                reject("API interface not defined");
            }
            else {
                this._apiInterface.getBuddyList("/buddies/" + this._id)
                    .then((response) => {
                    const list = response.map((item) => (item.buddy));
                    this._evemitter.emit(Brouser.EVT_GOTBUDDIES, list);
                    resolve(list);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
        });
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
    get emitter() {
        return this._evemitter;
    }
    /**
     * @method domain() getter
     *
     * @returns ConvergenceDomain: _domain or undefined
     */
    get domain() {
        return this._domain;
    }
    /**
     * @method exid() getter
     *
     * @returns string: _extid
     */
    get extid() {
        return this._extid;
    }
    /**
     * @method exid() setter
     *
     * @param i string : new ext id
     */
    set extid(i) {
        this.extid = i;
        //this._evemitter.emit("extidchange")
    }
    /**
     * @method status() getter
     *
     * @returns string: _status
     */
    get status() {
        return this._status;
    }
    /**
     * @method status() setter
     *
     * @param s string : new status ('offline','available','dnd', 'away')
     */
    set status(s) {
        if (this._domain) {
            this._presence.setState("status", s);
            //this._evemitter.emit("statuschange",this._status)
        }
        else {
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
    isConnected() {
        if (this._session)
            return this._session.isConnected();
        else
            return false;
    }
    /**
     * @method isAuthenticated()
     *
     * @returns boolean: true if user is authenticated
     */
    isAuthenticated() {
        if (this._session)
            return this._session.isAuthenticated();
        else
            return false;
    }
    /**
     * @method getSessionId()
     *
     * @returns string: session id
     */
    getSessionId() {
        if (this._session)
            return this._session.sessionId();
        else
            return "";
    }
    /**
     * @method connect(opts)
     *  connescts to Convergenge Server and Api Server
     *
     * @param opts (optional): (user:username, password:passwd) - if not supplied try to reconnect
     * @returns Promise<any>: ConvergenceDomain
     */
    connect(opts) {
        return new Promise((resolve, reject) => {
            const res = {
                user: this._id, evt: "connected", value: "pippo"
            };
            this._connection.connect(opts)
                .then((d) => {
                this._domain = d;
                this.subscribeDomainEvents();
                this._session = d.session();
                res.value = d._domainId;
                this._evemitter.emit(Brouser.EVT_CONNECTED, res);
                this.status = "available";
                this._presence = d.presence();
                this._identity = d.identity();
                this._activities = d.activities();
                this._models = d.models();
                this._chats = d.chat();
                resolve(d);
            })
                .catch((error) => {
                //this._evemitter.emit("error", error)
                reject(error);
            });
        });
    }
    /**
     * @method disconnect()
     * disconnects from Convergence Server
     *
     * @returns Promise<any>: after disconnection domain is no longer available
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            this._connection.disconnect(this._domain)
                .then((res) => {
                //this._evemitter.emit("disconnected", this._id)
                resolve(res);
            })
                .catch((error) => {
                //this._evemitter.emit("error", error)
                reject(error);
            });
        });
    }
    /**
     * @method subscribe(userlist)
     * subscribe to userlist events. Emits "subscribed"
     * control the online presence and availability of other users
     *
     * @param userlist (optional): ["user1", "user2",...] - if not supplied get userlist from Api erver
     * @returns subscriptions: array of subcription
     */
    subscribe(userlist) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected");
            }
            let list = userlist;
            if (userlist == undefined && this._apiInterface != undefined) {
                try {
                    const response = yield this._apiInterface.getBuddyList("/buddies/" + this._id);
                    list = response.map((item) => (item.buddy));
                }
                catch (error) {
                    reject(error);
                }
            }
            if (this._domain) {
                this._presence.subscribe(list)
                    .then((subscriptions) => {
                    subscriptions.forEach((subscription) => {
                        this._subscriptions.push(subscription);
                    });
                    this._evemitter.emit(Brouser.EVT_SUBSCRIBED, this._subscriptions);
                    this.subscribePresenceEvents(this._id);
                    this.subscribeBuddiesPresenceEvents();
                    resolve(this._subscriptions);
                })
                    .catch((error) => {
                    //this._evemitter.emit("error", error)
                    reject(error);
                });
            }
        }));
    }
    /**
     * @method unsubscribe(username)
     * unsubscribe username. Emits "unsubscribed"
     *
     * @param username string: username to unsubscribe
     */
    unsubscribe(username) {
        const unsubscriptions = this._subscriptions.filter(subsc => subsc.user.username == username);
        for (let i = 0; i < unsubscriptions.length; i++) {
            this.unsubscribeBuddyEvents(this._subscriptions[i]);
            unsubscriptions[i].unsubscribe();
        }
        this._evemitter.emit(Brouser.EVT_UNSUBSCRIBED, username);
    }
    /**
     * @method unsubscribeAll()
     * unsubscribe all subscribed users. Emits "unsubscribedall"
     *
     */
    unsubscribeAll() {
        for (let i = 0; i < this._subscriptions.length; i++) {
            this.unsubscribeBuddyEvents(this._subscriptions[i]);
            this._subscriptions[i].unsubscribe();
        }
        this._subscriptions = [];
        this._evemitter.emit(Brouser.EVT_UNSUBSCRIBEDALL);
    }
    /**
     * @method searchUser()
     *
     * @param username string: username to search
     * @returns user: {username, firstName, lastName, displayName, email, isAnonimous}
     */
    searchUser(username) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected");
            }
            this._identity.user(username).then((user) => {
                resolve(user); // will be undefined if the user does not exist   
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
     * @method searchUserByEmail()
     *
     * @param email string: username to search
     * @returns user: {username, firstName, lastName, displayName, email, isAnonimous}
     */
    searchUserByEmal(email) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected");
            }
            this._identity.userByEmail(email).then((user) => {
                resolve(user); // will be undefined if the user does not exist   
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
    * @method search()
    *
    * @param query object: {fields:['firstname','lastName'], term: 'pippo', offset:0, limit:10, orderBy:{field:'lastName', ascending: true}}
    * @returns user array: [{username, firstName, lastName, displayName, email, isAnonimous}]
    */
    search(query) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected");
            }
            this._identity.search.then((users) => {
                resolve(users); // will be undefined if the user does not exist   
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
     * @method joinactivity(userlist)
     * join activity or create if not exists
     *
     * @param type string: activity type
     * @param id string: activity id
     * @returns joined activity
     */
    joinactivity(type, id) {
        const options = {
            autoCreate: {
                groupPermissions: {
                    "admins": ["join", "lurk", "set_state", "view_state", "manage", "remove"]
                }
            }
        };
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected");
            }
            this._activities.join(type, id, options).then((activity) => {
                this._activity.activity = activity;
                resolve(activity);
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
     * @method leaveactivity(leave)
     * leave activity
     *
     * @returns nothing
     */
    leaveactivity() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._activity.activity != undefined) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected");
            }
            this._activities.leave().then(() => {
                this._activity.activity = undefined;
                resolve("activity leaved");
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
     * @method getpartecipants()
     * leave activity
     *
     * @returns partecipats array
     */
    getparticipants() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._activity.activity != undefined) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected");
            }
            this._activities._participants = this._activities.activity.participants();
            resolve(this._activities._participants);
        }));
    }
    /*
     * EVENT SUBSCRIPTION
     *
     */
    subscribeDomainEvents() {
        this._domain.on(Conv.DisconnectedEvent.NAME, () => {
            this._evemitter.emit(Brouser.EVT_DISCONNECTED, this._id);
        });
        this._domain.on(Conv.ErrorEvent.NAME, () => {
            this._evemitter.emit(Brouser.EVT_ERROR, this._id);
        });
    }
    subscribePresenceEvents(user) {
        const res = {
            user: user, evt: "", value: {}
        };
        this._domain.presence(user).on(Conv.PresenceStateSetEvent.NAME, (ret) => {
            if (ret.state.has("status")) {
                this._status = ret.state.get("status");
                res.value = this._status;
                res.evt = "status_set";
            }
            this._evemitter.emit(Brouser.EVT_PRESENCESTATE, res);
        });
        this._domain.presence(user).on(Conv.PresenceStateRemovedEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_PRESENCESTATEREMOVED, ret);
        });
        this._domain.presence(user).on(Conv.PresenceStateClearedEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_PRESENCESTATECLEARED, ret);
        });
        this._domain.presence(user).on(Conv.PresenceAvailabilityChangedEvent.NAME, (ret) => {
            const res = {
                user: user, evt: "", value: {}
            };
            res.value = ret.available;
            res.evt = "availability_change";
            this._evemitter.emit(Brouser.EVT_PRESENCEAVAILABILITYCHANGED, ret);
        });
    }
    subscribeBuddyPresenceEvents(subscription) {
        const res = {
            user: subscription.user.username, evt: "", value: {}
        };
        subscription.on(Conv.PresenceStateSetEvent.NAME, (ret) => {
            if (ret.state.has("status")) {
                //this._status = ret.state.get("status");
                res.evt = "status_set";
                res.value = ret.state.get("status");
            }
            this._evemitter.emit(Brouser.EVT_PRESENCESTATE, res);
        });
        subscription.on(Conv.PresenceAvailabilityChangedEvent.NAME, (ret) => {
            const res = {
                user: subscription.user.username, evt: "", value: {}
            };
            res.value = ret.available;
            res.evt = "availability_change";
            this._evemitter.emit(Brouser.EVT_PRESENCEAVAILABILITYCHANGED, res);
        });
    }
    subscribeBuddiesPresenceEvents() {
        this._subscriptions.forEach((subscription) => {
            this.subscribeBuddyPresenceEvents(subscription);
        });
    }
    unsubscribeBuddyEvents(subscription) {
        subscription.removeAllListeners();
    }
    unsubscribeBuddiesEvents() {
        this._subscriptions.forEach((subscription) => {
            this.unsubscribeBuddyEvents(subscription);
        });
    }
}
exports.Brouser = Brouser;
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
Brouser.EVT_GOTBUDDIES = "buddies";
Brouser.EVT_CONNECTED = Conv.ConnectedEvent.NAME;
Brouser.EVT_SUBSCRIBED = "subscribed";
Brouser.EVT_UNSUBSCRIBED = "unsubscribed";
Brouser.EVT_UNSUBSCRIBEDALL = "unsubscribedall";
Brouser.EVT_ERROR = Conv.ErrorEvent.NAME;
Brouser.EVT_DISCONNECTED = Conv.DisconnectedEvent.NAME;
Brouser.EVT_PRESENCESTATE = Conv.PresenceStateSetEvent.NAME;
Brouser.EVT_PRESENCESTATEREMOVED = Conv.PresenceStateRemovedEvent.NAME;
Brouser.EVT_PRESENCESTATECLEARED = Conv.PresenceStateClearedEvent.NAME;
Brouser.EVT_PRESENCEAVAILABILITYCHANGED = Conv.PresenceAvailabilityChangedEvent.NAME;
// ACTION TYPES
Brouser.ACT_TYPE_PROJECT = "project";
