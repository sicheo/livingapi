/// <reference types="node" />
import EventEmitter from "events";
import { UserConnection } from "./interfaces/interfaces";
declare class Brouser {
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
    static EVT_GOTBUDDIES: string;
    static EVT_CONNECTED: string;
    static EVT_SUBSCRIBED: string;
    static EVT_UNSUBSCRIBED: string;
    static EVT_UNSUBSCRIBEDALL: string;
    static EVT_ERROR: string;
    static EVT_DISCONNECTED: string;
    static EVT_PRESENCESTATE: string;
    static EVT_PRESENCESTATEREMOVED: string;
    static EVT_PRESENCESTATECLEARED: string;
    static EVT_PRESENCEAVAILABILITYCHANGED: string;
    static EVT_ACTIVITYSESSIONLEFT: string;
    static EVT_ACTIVITYSESSIONJOINED: string;
    static EVT_ACTIVITYSTATESET: string;
    static EVT_ACTIVITYSTATEREMOVED: string;
    static EVT_ACTIVITYSTATECLEARED: string;
    static ACT_TYPE_PROJECT: string;
    private _id;
    private _extid;
    private _status;
    private _evemitter;
    private _connection;
    private _apiInterface;
    private _domain;
    private _session;
    private _identity;
    private _presence;
    private _subscriptions;
    private _activities;
    private _activity;
    private _models;
    private _chats;
    /**
     * @constructor
     *
     * @param id string: user id
     * @param connection UserConnection: connection to server(s)
     */
    constructor(id: string, connection: UserConnection);
    /**
     * @method id() getter
     *
     * @returns string: _id
     */
    get id(): string;
    /**
     * @method getBuddies()
     *
     * @returns string[]: array of userid
     */
    getBuddies(): Promise<any>;
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
    get emitter(): EventEmitter;
    /**
     * @method domain() getter
     *
     * @returns ConvergenceDomain: _domain or undefined
     */
    get domain(): any;
    /**
     * @method exid() getter
     *
     * @returns string: _extid
     */
    get extid(): string;
    /**
     * @method exid() setter
     *
     * @param i string : new ext id
     */
    set extid(i: string);
    /**
     * @method status() getter
     *
     * @returns string: _status
     */
    get status(): string;
    /**
     * @method status() setter
     *
     * @param s string : new status ('offline','available','dnd', 'away')
     */
    set status(s: string);
    /**
     * @method isConnected()
     *
     * @returns boolean: true if user is connected to server(s)
     */
    isConnected(): boolean;
    /**
     * @method isAuthenticated()
     *
     * @returns boolean: true if user is authenticated
     */
    isAuthenticated(): boolean;
    /**
     * @method getSessionId()
     *
     * @returns string: session id
     */
    getSessionId(): string;
    /**
     * @method connect(opts)
     *  connescts to Convergenge Server and Api Server
     *
     * @param opts (optional): (user:username, password:passwd) - if not supplied try to reconnect
     * @returns Promise<any>: ConvergenceDomain
     */
    connect(opts?: any): Promise<any>;
    /**
     * @method disconnect()
     * disconnects from Convergence Server
     *
     * @returns Promise<any>: after disconnection domain is no longer available
     */
    disconnect(): Promise<any>;
    /**
     * @method subscribe(userlist)
     * subscribe to userlist events. Emits "subscribed"
     * control the online presence and availability of other users
     *
     * @param userlist (optional): ["user1", "user2",...] - if not supplied get userlist from Api erver
     * @returns subscriptions: array of subcription
     */
    subscribe(userlist?: string[]): Promise<unknown>;
    /**
     * @method unsubscribe(username)
     * unsubscribe username. Emits "unsubscribed"
     *
     * @param username string: username to unsubscribe
     */
    unsubscribe(username: string): void;
    /**
     * @method unsubscribeAll()
     * unsubscribe all subscribed users. Emits "unsubscribedall"
     *
     */
    unsubscribeAll(): Promise<unknown>;
    /**
     * @method searchUser()
     *
     * @param username string: username to search
     * @returns user: {username, firstName, lastName, displayName, email, isAnonimous}
     */
    searchUser(username: string): Promise<unknown>;
    /**
    * @method search()
    *
    * @param query object: {fields:['firstname','lastName'], term: 'pippo', offset:0, limit:10, orderBy:{field:'lastName', ascending: true}}
    * @returns user array: [{username, firstName, lastName, displayName, email, isAnonimous}]
    */
    search(query: any): Promise<unknown>;
    /**
    * @method getGroup()
    *
    * @returns groups object: user group info object
    */
    getGroup(): Promise<unknown>;
    /**
     * @method joinActivity(type,id)
     * join activity or create if not exists
     *
     * @param type string: activity type
     * @param id string: activity id
     * @returns joined activity
     */
    joinActivity(type: string, id: string): Promise<unknown>;
    /**
     * @method leaveActivity()
     * leave activity
     *
     * @returns nothing
     */
    leaveActivity(): Promise<unknown>;
    /**
     * @method getPartecipants()
     * get activity participants
     *
     * @returns partecipats array
     */
    getParticipants(): Promise<unknown>;
    /**
     * @method removeActivity()
     * remove activity
     *
     * @returns nothing
     */
    removeActivity(): Promise<unknown>;
    /**
     * @method setActivityState(key, value)
     * set activity state (key) to value
     *
     * @param key string: state key
     * @param value string: state value
     * @returns nothing
     */
    setActivityState(key: string, value: string): Promise<unknown>;
    /**
     * @method setActivityPermissions(type,perm)
     * set activity permissions by type
     *
     * @param type string: "user"|"group"|"world"
     * @param perm object: {"name":["join" | "lurk" | "view_state" | "set_state" | "remove" | "manage"]}
     * @returns nothing
     */
    setActivityPermissions(type: string, perm: any): Promise<unknown>;
    /**
    * @method getActivityPermissions(type)
    * set activity permissions by type
    *
    * @param type string: "user"|"group"|"world"
    * @returns activity permissions
    */
    getActivityPermissions(type: string): Promise<unknown>;
    /**
     * @method getActivityState(key)
     * get activity state (key)
     *
     * @param key string: state key
     * @returns activity state value
     */
    getActivityState(key: string): Promise<unknown>;
    /**
     * @method removeActivityState(key)
     *  set activity state (key) to value
     *
     * @param key string: state key
     * @returns nothing
     */
    removeActivityState(key: string): Promise<unknown>;
    /**
     * @method clearActivityState()
     * clear activity
     *
     * @returns nothing
     */
    clearActivityState(): Promise<unknown>;
    private subscribeDomainEvents;
    private subscribePresenceEvents;
    private subscribeBuddyPresenceEvents;
    private subscribeBuddiesPresenceEvents;
    private unsubscribeBuddyEvents;
    private unsubscribeBuddiesEvents;
    private subscribeActivityEvents;
}
export { Brouser };
//# sourceMappingURL=brouser.d.ts.map