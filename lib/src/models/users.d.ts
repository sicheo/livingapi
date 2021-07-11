export declare class LivingUserModel {
    private db;
    constructor(connectionstring: string);
    getUser(email: string): Promise<unknown>;
    getUsers(): Promise<unknown>;
}
//# sourceMappingURL=users.d.ts.map