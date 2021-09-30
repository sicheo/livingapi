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

    // CONNECTION EVENTS
    static EVT_GOTBUDDIES = "buddies"
    static EVT_CONNECTED = "conn_"+Conv.ConnectedEvent.NAME
    static EVT_SUBSCRIBED = "conn_subscribed"
    static EVT_UNSUBSCRIBED = "conn_unsubscribed"
    static EVT_UNSUBSCRIBEDALL = "conn_unsubscribedall"
    static EVT_ERROR = "conn_" +Conv.ErrorEvent.NAME
    static EVT_DISCONNECTED = "conn_" +Conv.DisconnectedEvent.NAME
    // PRESENCE EVENTS
    static EVT_PRESENCESTATE = "pres_" +Conv.PresenceStateSetEvent.NAME
    static EVT_PRESENCESTATEREMOVED = "pres_" +Conv.PresenceStateRemovedEvent.NAME
    static EVT_PRESENCESTATECLEARED = "pres_" +Conv.PresenceStateClearedEvent.NAME
    static EVT_PRESENCEAVAILABILITYCHANGED = "pres_" +Conv.PresenceAvailabilityChangedEvent.NAME
    // ACTIVITY EVENTS
    static EVT_ACTIVITYSESSIONLEFT = "act_" +Conv.ActivitySessionLeftEvent.EVENT_NAME
    static EVT_ACTIVITYSESSIONJOINED = "act_" +Conv.ActivitySessionJoinedEvent.EVENT_NAME
    static EVT_ACTIVITYSTATESET = "act_" +Conv.ActivityStateSetEvent.EVENT_NAME
    static EVT_ACTIVITYSTATEREMOVED = "act_" +Conv.ActivityStateRemovedEvent.EVENT_NAME
    static EVT_ACTIVITYSTATECLEARED = "act_" +Conv.ActivityStateClearedEvent.EVENT_NAME
    static EVT_ACTIVITYLEFT = "act_left"
    static EVT_ACTIVITYDELETED = "act_deleted"
    static EVT_ACTIVITYFORCELEAVE = "act_force_leave"
    // CHAT EVENTS
    static EVT_CHATJOIN = "chat_" + Conv.ChatJoinedEvent.NAME
    static EVT_CHATLEFT = "chat_" + Conv.ChatLeftEvent.NAME
    static EVT_CHATMESSAGE = "chat_" + Conv.ChatMessageEvent.NAME
    static EVT_CHATNAMECHANGED = "chat_" + Conv.ChatNameChangedEvent.NAME
    static EVT_CHATREMOVED = "chat_" + Conv.ChatRemovedEvent.NAME
    static EVT_CHATTOPICCHANGED = "chat_" + Conv.ChatTopicChangedEvent.NAME
    static EVT_CHATUSERADDED = "chat_" + Conv.UserAddedEvent.NAME
    static EVT_CHATUSERLEFT = "chat_" + Conv.UserLeftEvent.NAME
    static EVT_CHATUSERREMOVED = "chat_" + Conv.UserRemovedEvent.NAME
    static EVT_CHATEVENTSMARKEDSEEN = "chat_" + Conv.ChatEventsMarkedSeenEvent.NAME

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
    private _activity= { activity: undefined, participants:[]}
    private _models: any
    private _chatsrv: any
    private _dchat:any


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
     * @method getDirectChat()
     *
     * @returns chat: direct chat
     */
    getDirectChat(): any {
            return this._dchat
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
                    this._chatsrv = d.chat()
                    this.status = "available"
                    this._evemitter.emit(Brouser.EVT_CONNECTED, res)
                    resolve(this._domain)
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
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < this._subscriptions.length; i++) {
                this.unsubscribeBuddyEvents(this._subscriptions[i])
                this._subscriptions[i].unsubscribe()
            }
            this._subscriptions = []
            this._evemitter.emit(Brouser.EVT_UNSUBSCRIBEDALL)
            resolve("unsubscribed")
        })
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
            this._identity.search(query).then((users: any) => {
                resolve(users); // will be undefined if the user does not exist   
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    /**
    * @method getGroup()
    *
    * @returns groups object: user group info object
    */

    getGroup() {
        return new Promise(async (resolve, reject) => {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Not connected")
            }
            const query = ['LivigGroup']
            this._identity.groups(query).then((groups: any) => {
                resolve(groups[0]); // will be undefined if the user does not exist   
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    /**
     * @method joinActivity(type,id)
     * join activity or create if not exists
     * 
     * @param type string: activity type
     * @param id string: activity id
     * @returns joined activity
     */
    joinActivity(type: string, id: string, sub=true) {
        const options = {
            autoCreate: {
                groupPermissions: [{
                   "LivingGroup": ["join", "lurk", "set_state", "view_state"],
                }],
                worldPermissions: ["join", "set_state", "view_state"]
            }
        }
        return new Promise(async (resolve, reject) => {
            if (!this.isConnected()) {
                //this._evemitter.emit("error", "Not connected")
                reject("Join Activity Not connected")
            }
            this._activities.join(type, id, options).then((activity: any) => {
                this._activity.activity = activity
                if(sub)
                    this.subscribeActivityEvents(activity)
                resolve(activity)
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    /**
     * @method leaveActivity()
     * leave activity 
     * 
     * @returns nothing
     */
    leaveActivity() {
        return new Promise(async (resolve, reject) => {
            if (this._activity == undefined) {
                //this._evemitter.emit("error", "Not connected")
                reject("Leave Activity Not connected")
            }
            const act: any = this._activity.activity
            act.leave().then(() => {
                //this.unsubscribeActivityEvents(act)
                this._activity.activity = undefined
                this._activity.participants = []
                resolve("activity leaved")
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    /**
     * @method getPartecipants()
     * get activity participants 
     * 
     * @returns partecipats array
     */
    getParticipants() {
        return new Promise(async (resolve, reject) => {
            if (!this._activity.activity != undefined) {
                //this._evemitter.emit("error", "Not connected")
                reject("Get Participants Not connected")
            }
            const act:any = this._activity.activity
            this._activity.participants = act.participants()
            resolve(this._activities._participants)
        })
    }

    /**
     * @method removeActivity()
     * remove activity 
     * 
     * @returns nothing
     */
    removeActivity() {
        return new Promise(async (resolve, reject) => {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Remove Activity Not connected")
            }
            const act:any = this._activity.activity
            if (act != undefined){
                const type = act.type()
                const id = act.id()
                this._activities.remove(id, type).then(() => {
                    //this.unsubscribeActivityEvents(act)
                    this._activity.activity = undefined
                    resolve("activity removed")
                }).catch((error: any) => {
                    reject(error)
                })
            }
        })
    }

    /**
     * @method setActivityState(key, value)
     * set activity state (key) to value
     * 
     * @param key string: state key
     * @param value string: state value
     * @returns nothing
     */
    setActivityState(key:string,value:string) {
        return new Promise(async (resolve, reject) => {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Set Activity State Not connected")
            }
            const act: any = this._activity.activity
            if (act != undefined) {
                act.setState(key,value)
                resolve("state setted")
            }
        })
    }

    /**
     * @method setActivityPermissions(type,perm)
     * set activity permissions by type
     * 
     * @param type string: "user"|"group"|"world"
     * @param perm object: {"name":["join" | "lurk" | "view_state" | "set_state" | "remove" | "manage"]}
     * @returns nothing
     */
    setActivityPermissions(type:string, perm:any) {
        return new Promise(async (resolve, reject) => {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Set Activity Permission Not connected")
            }
            const act: any = this._activity.activity
            const permissions: any = act.permissions()
            if (permissions != undefined) {
                switch (type) {
                    case "user":
                        permissions.setUserPermissions(perm)
                            .then(() => {
                                resolve("user permission set")
                            }).catch((error:any) => {
                                reject(error)
                            })
                        break;
                    case "group":
                        permissions.setGroupPermissions(perm)
                            .then(() => {
                                resolve("group permission set")
                            }).catch((error: any) => {
                                console.log(error)
                                reject(error)
                            })
                        break;
                    case "world":
                        permissions.setWorldPermissions(perm)
                            .then(() => {
                                resolve("world permission set")
                            }).catch((error: any) => {
                                reject(error)
                            })
                        break;
                    default:
                        reject("bad perm group")
                }
            }
        })
    }

    /**
    * @method getActivityPermissions(type)
    * set activity permissions by type
    * 
    * @param type string: "user"|"group"|"world"
    * @returns activity permissions
    */
    getActivityPermissions(type: string) {
        return new Promise(async (resolve, reject) => {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Get Activity Permissions Not connected")
            }
            const act: any = this._activity.activity
            const permissions: any = act.permissions()
            if (act != undefined) {
                switch (type) {
                    case "user":
                        permissions.getUserPermissions()
                            .then((perms:any) => {
                                resolve(perms)
                            }).catch((error: any) => {
                                reject(error)
                            })
                        break;
                    case "group":
                        permissions.getGroupPermissions()
                            .then((perms:any) => {
                                resolve(perms)
                            }).catch((error: any) => {
                                reject(error)
                            })
                        break;
                    case "world":
                        permissions.getWorldPermissions()
                            .then((perms:any) => {
                                resolve(perms)
                            }).catch((error: any) => {
                                reject(error)
                            })
                        break;
                    default:
                        reject("bad perm group")
                }
            }
        })
    }

    
    /**
     * @method getActivityState(key)
     * get activity state (key)
     * 
     * @param key string: state key
     * @returns activity state value
     */
    getActivityState(key: string) {
        return new Promise(async (resolve, reject) => {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Get Activity State Not connected")
            }
            const act: any = this._activity.activity
            if (act != undefined) {
                const state = act.state().get(key)
                resolve(state)
            }
        })
    }

    /**
     * @method removeActivityState(key)
     *  set activity state (key) to value
     *
     * @param key string: state key
     * @returns nothing
     */
    removeActivityState(key: string) {
        return new Promise(async (resolve, reject) => {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Remove Activity State Not connected")
            }
            const act: any = this._activity.activity
            if (act != undefined) {
                act.removeState(key)
                resolve("state removed")
            }
        })
    }

    /**
     * @method clearActivityState()
     * clear activity
     * 
     * @returns nothing
     */
    clearActivityState() {
        return new Promise(async (resolve, reject) => {
            if ((this._activity == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Clear activity Not connected")
            }
            const act: any = this._activity.activity
            if (act != undefined) {
                act.clearState()
                resolve("state cleared")
            }
        })
    }

    /**
     * @method createRoomChat()
     * create room chat (do nothing if room exists)
     * 
     * @param id string: chat room id
     * @param topic [optional] string: chat topic
     * @returns roomId
     */
    createRoomChat(id:string, topic?:string) {
        return new Promise(async (resolve, reject) => {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected")
            }
            this._chatsrv.create({
                id: id,
                name: id,
                topic:topic,
                type: "room",
                membership: "public",
                ignoreExistsError: true
            }).then((ret: any) => {
                this._chatsrv.get(ret)
                    .then((chat: any) => {
                        this.subscribeChatEvents(chat)
                        resolve(ret)
                    }).catch((error: any) => {
                        reject(error)
                    })
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    /**
     * @method createDirectChat()
     * create direct chat 
     * 
     * @param users []string: list of users
     * @returns dicrect channel
     */
    createDirectChat(users: string[]) {
        return new Promise(async (resolve, reject) => {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected")
            }
            this._chatsrv.direct(users)
            .then((chat: any) => {
                this.subscribeChatEvents(chat)
                this._dchat = chat
                resolve(chat)
            }).catch((error: any) => {
                reject(error)
            })
        })
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
    createChannelChat(id: string, topic:string, members?:any) {
        return new Promise(async (resolve, reject) => {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected")
            }
            this._chatsrv.create({
                id: id,
                name: id,
                type: "channel",
                membership: "public",
                members:members,
                topic: topic,
                ignoreExistsError: true
            }).then((ret: any) => {
                this._chatsrv.get(ret)
                    .then((chat: any) => {
                        this.subscribeChatEvents(chat)
                        resolve(ret)
                    }).catch((error: any) => {
                        reject(error)
                    })
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    /**
    * @method chatRemove()
    * remove a chat chat
    * 
    * @param id string: chat id
    */
    chatRemove(id: string) {
        return new Promise(async (resolve, reject) => {
            this._chatsrv.remove(id)
                .then((ret: any) => {
                    resolve(ret)
                }).catch((error: any) => {
                    reject(error)
                })
        })
    }

    /**
    * @method chatJoin()
    * joins chat
    * 
    * @param id string: chat id
    */
    chatJoin(id: string) {
        return new Promise(async (resolve, reject) => {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected")
            }
            this._chatsrv.get(id)
                .then((chat: any) => {
                    if (!chat.isJoined()) {
                        //console.log("CHAT NOT JOINED YET")
                        this._chatsrv.join(id)
                            .then((chat: any) => {
                                //console.log("CHAT JOINED")
                                resolve(chat)
                            }).catch((error: any) => {
                                //console.log("CHAT JOIN ERROR")
                                reject(error)
                            })
                    }
                    else {
                        //console.log("CHAT ALREADY JOINED")
                        resolve(chat)
                    }
                }).catch((error: any) => {
                    //console.log("CHAT GET ERROR")
                    reject(error)
                })
        })
    }

    /**
    * @method chatSend()
    * send message to chat
    * 
    * @param id string: chat id
    * @param message string: chat message
    * @param direct boolean: true if direct chat
    */
    chatSend(id: string, message:string, direct=false) {
        return new Promise(async (resolve, reject) => {
            if ((this._chatsrv == undefined)) {
                //this._evemitter.emit("error", "Not connected")
                reject("Create Chat: Not connected")
            }
            if (direct) {
                if ((this._dchat == undefined)) {
                    reject("Chat Send: Direct Chat not creted")
                }
                this._dchat.send(message)
                .then((ret: any) => {
                    resolve(ret)
                })
                .catch((error: any) => {
                    reject(error)
                })
            }
            else {
                this._chatsrv.get(id)
                    .then((chat: any) => {
                        chat.send(message)
                            .then((ret: any) => {
                                resolve(ret)
                            })
                            .catch((error: any) => {
                                reject(error)
                            })
                    }).catch((error: any) => {
                        reject(error)
                    })
            }
        })
    }

    /**
    * @method chatAdd()
    * add user to private chat
    * 
    * @param id string: chat id
    * @param user string: user to add
    */
    chatAdd(id: string, user: string) {
        return new Promise(async (resolve, reject) => {
            this._chatsrv.get(id)
                .then((chat: any) => {
                    const info = chat.info().members
                    let found = false
                    for (let i = 0; i < info.length;i++ ) {
                        if (info[i].user.username == user)
                            found = true
                    }
                    if (!found) {
                        console.log("CHAT ADD")
                        chat.add(user)
                            .then((ret: any) => {
                                resolve(ret)
                            })
                            .catch((error: any) => {
                                //console.log("CHAT ADD ERROR")
                                reject(error)
                            })
                    } else {resolve(user)}
                }).catch((error: any) => {
                    //console.log("CHAT GET ERROR")
                    reject(error)
                })
        })
    }

    /**
    * @method chatLeave()
    * leave a joined chat
    * 
    * @param id string: chat id
    */
    chatLeave(id: string) {
        return new Promise(async (resolve, reject) => {
            this._chatsrv.leave(id)
                .then((ret: any) => {
                   resolve(ret)
                }).catch((error: any) => {
                    reject(error)
                })
        })
    }

    /**
    * @method chatChangeName()
    * leave a joined chat
    * 
    * @param id string: chat id
    * @param newname string: new name
    */
    chatChangeName(id: string, newname:string) {
        return new Promise(async (resolve, reject) => {
            this._chatsrv.get(id)
                .then((chat: any) => {
                    chat.setName(newname)
                        .then((ret: any) => {
                            resolve(ret)
                        })
                        .catch((error: any) => {
                            reject(error)
                        })
                }).catch((error: any) => {
                    reject(error)
                })
        })
    }

    /**
    * @method chatChangeTopic()
    * leave a joined chat
    * 
    * @param id string: chat id
    * @param newtopic string: new topic
    */
    chatChangeTopic(id: string, newtopic: string) {
        return new Promise(async (resolve, reject) => {
            this._chatsrv.get(id)
                .then((chat: any) => {
                    chat.setTopic(newtopic)
                        .then((ret: any) => {
                            resolve(ret)
                        })
                        .catch((error: any) => {
                            reject(error)
                        })
                }).catch((error: any) => {
                    reject(error)
                })
        })
    }

    /**
    * @method chatGetInfo()
    * gets chat info
    * 
    * @param id string: chat id
    * @returns chat info
    */
    chatGetInfo(id: string) {
        return new Promise(async (resolve, reject) => {
            this._chatsrv.get(id)
                .then((chat: any) => {
                    resolve(chat.info())
                }).catch((error: any) => {
                    reject(error)
                })
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

    private unsubscribeActivityEvents(activity: Conv.Activity) {
        activity.removeAllListeners()
    }

    private subscribeActivityEvents(activity: Conv.Activity) {
        activity.on(Conv.ActivitySessionLeftEvent.EVENT_NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSESSIONLEFT, ret)
        })

        activity.on(Conv.ActivitySessionJoinedEvent.EVENT_NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSESSIONJOINED, ret)
        })

        activity.on(Conv.ActivityStateSetEvent.EVENT_NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSTATESET, ret)
        })

        activity.on(Conv.ActivityStateRemovedEvent.EVENT_NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSTATEREMOVED, ret)
        })

        activity.on(Conv.ActivityStateClearedEvent.EVENT_NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYSTATECLEARED, ret)
        })

        activity.on("left", (ret: any) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYLEFT, ret)
        })

        activity.on("deleted", (ret: any) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYDELETED, ret)
        })

        activity.on("force_leave", (ret: any) => {
            this._evemitter.emit(Brouser.EVT_ACTIVITYFORCELEAVE, ret)
        })
    }

    private subscribeChatEvents(chat: Conv.Chat) {
        this._chatsrv.on(Conv.ChatJoinedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATJOIN, ret)
        })

        this._chatsrv.on(Conv.ChatLeftEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATLEFT, ret)
        })

        /*chat.on(Conv.ChatLeftEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATLEFT, ret)
        })*/

        chat.on(Conv.ChatMessageEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATMESSAGE, ret)
        })

        chat.on(Conv.ChatNameChangedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATNAMECHANGED, ret)
        })

        chat.on(Conv.ChatRemovedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATREMOVED, ret)
        })

        this._chatsrv.on(Conv.UserAddedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATUSERADDED, ret)
        })

        chat.on(Conv.UserAddedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATUSERADDED, ret)
        })

        chat.on(Conv.UserLeftEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATUSERLEFT, ret)
        })

        chat.on(Conv.UserRemovedEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATUSERREMOVED, ret)
        })

        chat.on(Conv.ChatEventsMarkedSeenEvent.NAME, (ret: any) => {
            this._evemitter.emit(Brouser.EVT_CHATEVENTSMARKEDSEEN, ret)
        })
        
    }

    private unsubscribeChatEvents(chat: Conv.Chat) {
        chat.removeAllListeners()
    }

}

export { Brouser};