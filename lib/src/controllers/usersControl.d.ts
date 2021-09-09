export declare class LivingUserController {
    private usermodel;
    constructor(connectionstring: string);
    private init;
    getUserLogin(email: string, password: string): Promise<unknown>;
    insertUser(user: any): Promise<unknown>;
    deletetUser(email: string): Promise<unknown>;
    changePassword(email: string, password: string): Promise<unknown>;
}
//# sourceMappingURL=usersControl.d.ts.map