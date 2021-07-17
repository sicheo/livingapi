interface UserConnection {
    connect(opts?: any): Promise<any>;
    disconnect(opts?: any): Promise<any>;
}
interface UserAuthenticate {
    authenticate(opts?: any): Promise<any>;
}
export { UserConnection, UserAuthenticate };
//# sourceMappingURL=interfaces.d.ts.map