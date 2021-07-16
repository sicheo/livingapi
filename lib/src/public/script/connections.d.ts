import "reflect-metadata";
import { UserConnection } from "./interfaces";
export declare class AnonymousConnection implements UserConnection {
    private _url;
    constructor(url: string);
    connect(): Promise<unknown>;
    disconnect(domain: any): Promise<unknown>;
}
export declare class PasswordConnection implements UserConnection {
    private _url;
    private _user;
    private _password;
    constructor(url: string, user: string, password: string);
    connect(): Promise<unknown>;
    disconnect(domain: any): Promise<unknown>;
}
export declare class JwtConnection implements UserConnection {
    private _url;
    private _token;
    constructor(url: string, token: string);
    connect(): Promise<unknown>;
    disconnect(domain: any): Promise<unknown>;
}
//# sourceMappingURL=connections.d.ts.map