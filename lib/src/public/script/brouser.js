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
const isomorphic_ws_1 = tslib_1.__importDefault(require("isomorphic-ws"));
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
        this._activity = { activity: undefined, participants: [] };
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
     * @method getDirectChat()
     *
     * @returns chat: direct chat
     */
    getDirectChat() {
        return this._dchat;
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
                user: this._id, evt: "connected", domain: "pippo", session: isomorphic_ws_1.default
            };
            this._connection.connect(opts)
                .then((d) => {
                this._domain = d;
                this.subscribeDomainEvents();
                this._session = d.session();
                res.domain = d._domainId;
                res.session = this._session.sessionId();
                this._presence = d.presence();
                this._identity = d.identity();
                this._activities = d.activities();
                this._models = d.models();
                this._chatsrv = d.chat();
                this.status = "available";
                this._evemitter.emit(Brouser.EVT_CONNECTED, res);
                resolve(this._domain);
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
                this._evemitter.emit("disconnected", this._id);
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
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this._subscriptions.length; i++) {
                this.unsubscribeBuddyEvents(this._subscriptions[i]);
                this._subscriptions[i].unsubscribe();
            }
            this._subscriptions = [];
            this._evemitter.emit(Brouser.EVT_UNSUBSCRIBEDALL);
            resolve("unsubscribed");
        }));
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
            this._identity.search(query).then((users) => {
                resolve(users); // will be undefined if the user does not exist   
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
    * @method getGroup()
    *
    * @returns groups object: user group info object
    */
    getGroup() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected");
            }
            const query = ['LivigGroup'];
            this._identity.groups(query).then((groups) => {
                resolve(groups[0]); // will be undefined if the user does not exist   
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
     * @method joinActivity(type,id)
     * join activity or create if not exists
     *
     * @param type string: activity type
     * @param id string: activity id
     * @returns joined activity
     */
    joinActivity(type, id, sub = true) {
        const options = {
            autoCreate: {
                groupPermissions: [{
                        "LivingGroup": ["join", "lurk", "set_state", "view_state"],
                    }],
                worldPermissions: ["join", "set_state", "view_state"]
            }
        };
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Join Activity Not connected");
            }
            this._activities.join(type, id, options).then((activity) => {
                this._activity.activity = activity;
                if (sub)
                    this.subscribeActivityEvents(activity);
                resolve(activity);
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
     * @method leaveActivity()
     * leave activity
     *
     * @returns nothing
     */
    leaveActivity() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._activity == undefined) {
                //this._evemitter.emit("error", "Not connected")
                reject("Leave Activity Not connected");
            }
            const act = this._activity.activity;
            act.leave().then(() => {
                //this.unsubscribeActivityEvents(act)
                this._activity.activity = undefined;
                this._activity.participants = [];
                resolve("activity leaved");
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
     * @method getPartecipants()
     * get activity participants
     *
     * @returns partecipats array
     */
    getParticipants() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._activity.activity != undefined) {
                //this._evemitter.emit("error", "Not connected")
                reject("Get Participants Not connected");
            }
            const act = this._activity.activity;
            this._activity.participants = act.participants();
            resolve(this._activities._participants);
        }));
    }
    /**
     * @method removeActivity()
     * remove activity
     *
     * @returns nothing
     */
    removeActivity() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Remove Activity Not connected");
            }
            const act = this._activity.activity;
            if (act != undefined) {
                const type = act.type();
                const id = act.id();
                this._activities.remove(id, type).then(() => {
                    //this.unsubscribeActivityEvents(act)
                    this._activity.activity = undefined;
                    resolve("activity removed");
                }).catch((error) => {
                    reject(error);
                });
            }
        }));
    }
    /**
     * @method setActivityState(key, value)
     * set activity state (key) to value
     *
     * @param key string: state key
     * @param value string: state value
     * @returns nothing
     */
    setActivityState(key, value) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Set Activity State Not connected");
            }
            const act = this._activity.activity;
            if (act != undefined) {
                act.setState(key, value);
                resolve("state setted");
            }
        }));
    }
    /**
     * @method setActivityPermissions(type,perm)
     * set activity permissions by type
     *
     * @param type string: "user"|"group"|"world"
     * @param perm object: {"name":["join" | "lurk" | "view_state" | "set_state" | "remove" | "manage"]}
     * @returns nothing
     */
    setActivityPermissions(type, perm) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Set Activity Permission Not connected");
            }
            const act = this._activity.activity;
            const permissions = act.permissions();
            if (permissions != undefined) {
                switch (type) {
                    case "user":
                        permissions.setUserPermissions(perm)
                            .then(() => {
                            resolve("user permission set");
                        }).catch((error) => {
                            reject(error);
                        });
                        break;
                    case "group":
                        permissions.setGroupPermissions(perm)
                            .then(() => {
                            resolve("group permission set");
                        }).catch((error) => {
                            console.log(error);
                            reject(error);
                        });
                        break;
                    case "world":
                        permissions.setWorldPermissions(perm)
                            .then(() => {
                            resolve("world permission set");
                        }).catch((error) => {
                            reject(error);
                        });
                        break;
                    default:
                        reject("bad perm group");
                }
            }
        }));
    }
    /**
    * @method getActivityPermissions(type)
    * set activity permissions by type
    *
    * @param type string: "user"|"group"|"world"
    * @returns activity permissions
    */
    getActivityPermissions(type) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Get Activity Permissions Not connected");
            }
            const act = this._activity.activity;
            const permissions = act.permissions();
            if (act != undefined) {
                switch (type) {
                    case "user":
                        permissions.getUserPermissions()
                            .then((perms) => {
                            resolve(perms);
                        }).catch((error) => {
                            reject(error);
                        });
                        break;
                    case "group":
                        permissions.getGroupPermissions()
                            .then((perms) => {
                            resolve(perms);
                        }).catch((error) => {
                            reject(error);
                        });
                        break;
                    case "world":
                        permissions.getWorldPermissions()
                            .then((perms) => {
                            resolve(perms);
                        }).catch((error) => {
                            reject(error);
                        });
                        break;
                    default:
                        reject("bad perm group");
                }
            }
        }));
    }
    /**
     * @method getActivityState(key)
     * get activity state (key)
     *
     * @param key string: state key
     * @returns activity state value
     */
    getActivityState(key) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Get Activity State Not connected");
            }
            const act = this._activity.activity;
            if (act != undefined) {
                const state = act.state().get(key);
                resolve(state);
            }
        }));
    }
    /**
     * @method removeActivityState(key)
     *  set activity state (key) to value
     *
     * @param key string: state key
     * @returns nothing
     */
    removeActivityState(key) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Remove Activity State Not connected");
            }
            const act = this._activity.activity;
            if (act != undefined) {
                act.removeState(key);
                resolve("state removed");
            }
        }));
    }
    /**
     * @method clearActivityState()
     * clear activity
     *
     * @returns nothing
     */
    clearActivityState() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Clear activity Not connected");
            }
            const act = this._activity.activity;
            if (act != undefined) {
                act.clearState();
                resolve("state cleared");
            }
        }));
    }
    /**
     * @method createRoomChat()
     * create room chat (do nothing if room exists)
     *
     * @param id string: chat room id
     * @param topic [optional] string: chat topic
     * @returns roomId
     */
    createRoomChat(id, topic) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected");
            }
            this._chatsrv.create({
                id: id,
                name: id,
                topic: topic,
                type: "room",
                membership: "public",
                ignoreExistsError: true
            }).then((ret) => {
                this._chatsrv.get(ret)
                    .then((chat) => {
                    this.subscribeChatEvents(chat);
                    resolve(ret);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
     * @method createDirectChat()
     * create direct chat
     *
     * @param users []string: list of users
     * @returns dicrect channel
     */
    createDirectChat(users) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected");
            }
            this._chatsrv.direct(users)
                .then((chat) => {
                this.subscribeChatEvents(chat);
                this._dchat = chat;
                resolve(chat);
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
    * @method createChannelChat()
    * create channel chat (do nothing if channel exists)
    *
    * @param id string: chat channel id
    * @param topic string: chat channel
    * @param membres []string: chat channel members
    * @returns channel id
    */
    createChannelChat(id, topic, members) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected");
            }
            this._chatsrv.create({
                id: id,
                name: id,
                type: "channel",
                membership: "public",
                members: members,
                topic: topic,
                ignoreExistsError: true
            }).then((ret) => {
                this._chatsrv.get(ret)
                    .then((chat) => {
                    this.subscribeChatEvents(chat);
                    resolve(ret);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
    * @method chatRemove()
    * remove a chat chat
    *
    * @param id string: chat id
    */
    chatRemove(id) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._chatsrv.remove(id)
                .then((ret) => {
                resolve(ret);
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
    * @method chatJoin()
    * joins chat
    *
    * @param id string: chat id
    */
    chatJoin(id) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected");
            }
            this._chatsrv.get(id)
                .then((chat) => {
                if (!chat.isJoined()) {
                    //console.log("CHAT NOT JOINED YET")
                    this._chatsrv.join(id)
                        .then((chat) => {
                        //console.log("CHAT JOINED")
                        resolve(chat);
                    }).catch((error) => {
                        //console.log("CHAT JOIN ERROR")
                        reject(error);
                    });
                }
                else {
                    //console.log("CHAT ALREADY JOINED")
                    resolve(chat);
                }
            }).catch((error) => {
                //console.log("CHAT GET ERROR")
                reject(error);
            });
        }));
    }
    /**
    * @method chatSend()
    * send message to chat
    *
    * @param id string: chat id
    * @param message string: chat message
    * @param direct boolean: true if direct chat
    */
    chatSend(id, message, direct = false) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected");
            }
            if (direct) {
                if ((this._dchat == undefined)) {
                    reject("Chat Send: Direct Chat not creted");
                }
                this._dchat.send(message)
                    .then((ret) => {
                    resolve(ret);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            else {
                this._chatsrv.get(id)
                    .then((chat) => {
                    chat.send(message)
                        .then((ret) => {
                        resolve(ret);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                }).catch((error) => {
                    reject(error);
                });
            }
        }));
    }
    /**
    * @method chatAdd()
    * add user to private chat
    *
    * @param id string: chat id
    * @param user string: user to add
    */
    chatAdd(id, user) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._chatsrv.get(id)
                .then((chat) => {
                const info = chat.info().members;
                let found = false;
                for (let i = 0; i < info.length; i++) {
                    if (info[i].user.username == user)
                        found = true;
                }
                if (!found) {
                    console.log("CHAT ADD");
                    chat.add(user)
                        .then((ret) => {
                        resolve(ret);
                    })
                        .catch((error) => {
                        //console.log("CHAT ADD ERROR")
                        reject(error);
                    });
                }
                else {
                    resolve(user);
                }
            }).catch((error) => {
                //console.log("CHAT GET ERROR")
                reject(error);
            });
        }));
    }
    /**
    * @method chatLeave()
    * leave a joined chat
    *
    * @param id string: chat id
    */
    chatLeave(id) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._chatsrv.leave(id)
                .then((ret) => {
                resolve(ret);
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
    * @method chatChangeName()
    * leave a joined chat
    *
    * @param id string: chat id
    * @param newname string: new name
    */
    chatChangeName(id, newname) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._chatsrv.get(id)
                .then((chat) => {
                chat.setName(newname)
                    .then((ret) => {
                    resolve(ret);
                })
                    .catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
    * @method chatChangeTopic()
    * leave a joined chat
    *
    * @param id string: chat id
    * @param newtopic string: new topic
    */
    chatChangeTopic(id, newtopic) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._chatsrv.get(id)
                .then((chat) => {
                chat.setTopic(newtopic)
                    .then((ret) => {
                    resolve(ret);
                })
                    .catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        }));
    }
    /**
    * @method chatGetInfo()
    * gets chat info
    *
    * @param id string: chat id
    * @returns chat info
    */
    chatGetInfo(id) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._chatsrv.get(id)
                .then((chat) => {
                resolve(chat.info());
            }).catch((error) => {
                reject(error);
            });
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
    unsubscribeActivityEvents(activity) {
        activity.removeAllListeners();
    }
    subscribeActivityEvents(activity) {
        activity.on(Conv.ActivitySessionLeftEvent.EVENT_NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSESSIONLEFT, ret);
        });
        activity.on(Conv.ActivitySessionJoinedEvent.EVENT_NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSESSIONJOINED, ret);
        });
        activity.on(Conv.ActivityStateSetEvent.EVENT_NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSTATESET, ret);
        });
        activity.on(Conv.ActivityStateRemovedEvent.EVENT_NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSTATEREMOVED, ret);
        });
        activity.on(Conv.ActivityStateClearedEvent.EVENT_NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSTATECLEARED, ret);
        });
        activity.on("left", (ret) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYLEFT, ret);
        });
        activity.on("deleted", (ret) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYDELETED, ret);
        });
        activity.on("force_leave", (ret) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYFORCELEAVE, ret);
        });
    }
    subscribeChatEvents(chat) {
        this._chatsrv.on(Conv.ChatJoinedEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATJOIN, ret);
        });
        this._chatsrv.on(Conv.ChatLeftEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATLEFT, ret);
        });
        /*chat.on(Conv.ChatLeftEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATLEFT, ret)
        })*/
        chat.on(Conv.ChatMessageEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATMESSAGE, ret);
        });
        chat.on(Conv.ChatNameChangedEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATNAMECHANGED, ret);
        });
        chat.on(Conv.ChatRemovedEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATREMOVED, ret);
        });
        this._chatsrv.on(Conv.UserAddedEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATUSERADDED, ret);
        });
        chat.on(Conv.UserAddedEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATUSERADDED, ret);
        });
        chat.on(Conv.UserLeftEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATUSERLEFT, ret);
        });
        chat.on(Conv.UserRemovedEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATUSERREMOVED, ret);
        });
        chat.on(Conv.ChatEventsMarkedSeenEvent.NAME, (ret) => {
            this._evemitter.emit(Brouser.EVT_CHATEVENTSMARKEDSEEN, ret);
        });
    }
    unsubscribeChatEvents(chat) {
        chat.removeAllListeners();
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
// CONNECTION EVENTS
Brouser.EVT_GOTBUDDIES = "buddies";
Brouser.EVT_CONNECTED = "conn_" + Conv.ConnectedEvent.NAME;
Brouser.EVT_SUBSCRIBED = "conn_subscribed";
Brouser.EVT_UNSUBSCRIBED = "conn_unsubscribed";
Brouser.EVT_UNSUBSCRIBEDALL = "conn_unsubscribedall";
Brouser.EVT_ERROR = "conn_" + Conv.ErrorEvent.NAME;
Brouser.EVT_DISCONNECTED = "conn_" + Conv.DisconnectedEvent.NAME;
// PRESENCE EVENTS
Brouser.EVT_PRESENCESTATE = "pres_" + Conv.PresenceStateSetEvent.NAME;
Brouser.EVT_PRESENCESTATEREMOVED = "pres_" + Conv.PresenceStateRemovedEvent.NAME;
Brouser.EVT_PRESENCESTATECLEARED = "pres_" + Conv.PresenceStateClearedEvent.NAME;
Brouser.EVT_PRESENCEAVAILABILITYCHANGED = "pres_" + Conv.PresenceAvailabilityChangedEvent.NAME;
// ACTIVITY EVENTS
Brouser.EVT_ACTIVITYSESSIONLEFT = "act_" + Conv.ActivitySessionLeftEvent.EVENT_NAME;
Brouser.EVT_ACTIVITYSESSIONJOINED = "act_" + Conv.ActivitySessionJoinedEvent.EVENT_NAME;
Brouser.EVT_ACTIVITYSTATESET = "act_" + Conv.ActivityStateSetEvent.EVENT_NAME;
Brouser.EVT_ACTIVITYSTATEREMOVED = "act_" + Conv.ActivityStateRemovedEvent.EVENT_NAME;
Brouser.EVT_ACTIVITYSTATECLEARED = "act_" + Conv.ActivityStateClearedEvent.EVENT_NAME;
Brouser.EVT_ACTIVITYLEFT = "act_left";
Brouser.EVT_ACTIVITYDELETED = "act_deleted";
Brouser.EVT_ACTIVITYFORCELEAVE = "act_force_leave";
// CHAT EVENTS
Brouser.EVT_CHATJOIN = "chat_" + Conv.ChatJoinedEvent.NAME;
Brouser.EVT_CHATLEFT = "chat_" + Conv.ChatLeftEvent.NAME;
Brouser.EVT_CHATMESSAGE = "chat_" + Conv.ChatMessageEvent.NAME;
Brouser.EVT_CHATNAMECHANGED = "chat_" + Conv.ChatNameChangedEvent.NAME;
Brouser.EVT_CHATREMOVED = "chat_" + Conv.ChatRemovedEvent.NAME;
Brouser.EVT_CHATTOPICCHANGED = "chat_" + Conv.ChatTopicChangedEvent.NAME;
Brouser.EVT_CHATUSERADDED = "chat_" + Conv.UserAddedEvent.NAME;
Brouser.EVT_CHATUSERLEFT = "chat_" + Conv.UserLeftEvent.NAME;
Brouser.EVT_CHATUSERREMOVED = "chat_" + Conv.UserRemovedEvent.NAME;
Brouser.EVT_CHATEVENTSMARKEDSEEN = "chat_" + Conv.ChatEventsMarkedSeenEvent.NAME;
// ACTION TYPES
Brouser.ACT_TYPE_PROJECT = "project";
