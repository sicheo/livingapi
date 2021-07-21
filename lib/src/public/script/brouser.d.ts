/// <reference types="node" />
import EventEmitter from "events";
import { UserConnection } from "./interfaces/interfaces";
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
declare class Brouser {
    private _id;
    private _extid;
    private _status;
    private _evemitter;
    private _connection;
    private _apiInterface;
    private _domain;
    private _session;
    private _presence;
    private _subscriptions;
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
     * @method connect()
     *
     * @param opts (optional): {user:username, password:passwd} - if not supplied try to reconnect
     * @returns Promise<any>: ConvergenceDomain
     */
    connect(opts?: any): Promise<any>;
    /**
     * @method disconnect()
     *
     * @returns Promise<any>: after disconnection domain is no longer available
     */
    disconnect(): Promise<any>;
    /**
     * @method subscribe()
     *
     * @param userlist (optional): ["user1", "user2",...] - if not supplied get userlist from Api erver
     * @returns subscriptions: array of subcription
     */
    subscribe(userlist?: string[]): Promise<unknown>;
    unsubscribe(username: string): void;
    unsubscribeAll(): void;
    private subscribeDomainEvents;
    private subscribePresenceEvents;
    private subscribeBuddyPresenceEvents;
}
export { Brouser };
//# sourceMappingURL=brouser.d.ts.map