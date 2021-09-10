export declare class LivingUserModel {
    private db;
    constructor(connectionstring: string);
    getUser(email: string): Promise<unknown>;
    getUsers(): Promise<unknown>;
    insertUser(user: any): Promise<unknown>;
    deleteUser(email: string): Promise<unknown>;
    changePassword(email: string, password: string): Promise<unknown>;
    updateUser(user: any): Promise<unknown>;
}
//# sourceMappingURL=users.d.ts.map