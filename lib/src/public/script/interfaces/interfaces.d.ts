interface UserPersistenceApi {
    authenticate(opts?: any): Promise<any>;
    getBuddyList(url: string): Promise<any>;
}
interface UserConnection {
    connect(opts?: any): Promise<any>;
    disconnect(opts?: any): Promise<any>;
    isConnected(): boolean;
    isAuthenticated(): boolean;
    getApiInterface(): UserPersistenceApi | undefined;
}
export { UserConnection, UserPersistenceApi };
//# sourceMappingURL=interfaces.d.ts.map