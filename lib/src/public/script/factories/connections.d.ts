import { UserPersistenceApi, UserConnection } from "../interfaces/interfaces";
export declare class AnonymousConnection implements UserConnection {
    private _url;
    private _connected;
    private _authenticated;
    private _apiInterface;
    constructor(url: string);
    connect(): Promise<unknown>;
    disconnect(domain: any): Promise<unknown>;
    isAuthenticated(): boolean;
    isConnected(): boolean;
    getApiInterface(): UserPersistenceApi | undefined;
}
export declare class PasswordConnection implements UserConnection {
    private _url;
    private _user;
    private _password;
    private _connected;
    private _authenticated;
    private _apiInterface;
    constructor(url: string, user: string, password: string);
    connect(): Promise<unknown>;
    disconnect(domain: any): Promise<unknown>;
    isAuthenticated(): boolean;
    isConnected(): boolean;
    getApiInterface(): UserPersistenceApi | undefined;
}
export declare class JwtConnection implements UserConnection {
    private _url;
    private _token;
    private _connected;
    private _authenticated;
    private _apiInterface;
    constructor(url: string, apiInterface: UserPersistenceApi);
    connect(opts?: any): Promise<unknown>;
    disconnect(domain: any): Promise<unknown>;
    isAuthenticated(): boolean;
    isConnected(): boolean;
    getApiInterface(): UserPersistenceApi;
}
//# sourceMappingURL=connections.d.ts.map