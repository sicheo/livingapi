interface UserConnection {
    connect(opts?:any): Promise<any>;
    disconnect(opts?:any): Promise<any>;
}


export { UserConnection}