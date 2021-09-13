export declare class LivingBuddiesModel {
    private db;
    constructor(connectionstring: string);
    getBuddies(email: string): Promise<unknown>;
    addBuddy(item: any): Promise<unknown>;
    deleteBuddy(item: any): Promise<unknown>;
}
//# sourceMappingURL=buddies.d.ts.map