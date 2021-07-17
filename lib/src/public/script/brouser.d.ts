import "reflect-metadata";
import { UserConnection } from "./interfaces/interfaces";
declare class Brouser {
    private _id;
    private _extid;
    private _token;
    private _connected;
    private _status;
    private _evemitter;
    private _connection;
    private _domain;
    constructor(id: string, connection: UserConnection);
    get id(): string;
    get emitter(): any;
    get domain(): any;
    get token(): string;
    set token(t: string);
    get extid(): string;
    set extid(i: string);
    get status(): string;
    set status(s: string);
    set connection(conn: any);
    isConnected(): boolean;
    connect(opts?: any): Promise<any>;
    disconnect(opts?: any): Promise<any>;
    Hello(): void;
}
export { Brouser };
//# sourceMappingURL=brouser.d.ts.map