declare function _conv_connect(url: any, user: any, password: any): Promise<any>;
declare function _conv_connect_jwt(url: any, token: any): void;
declare function _conv_connect_anon(url: any): Promise<any>;
declare function _conv_subscribe_presence(usernames: any): Promise<any>;
declare function _conv_set_user(user: any): void;
declare function _conv_get_user(): string;
declare function _conv_set_status(status: any): void;
declare function _conv_get_status(): any;
declare function _conv_add_buddies(buddies: any): void;
declare function _conv_remove_buddies(buddies: any): void;
declare function _presence_convTest(divelem: any): void;
declare function _presence_fnChangePresence(newstatus: any): void;
declare function _presence_fnChangeBuddyList(): void;
declare function _presence_fnInizialize(): void;
declare namespace _convergence_app {
    const connected: boolean;
    const user: string;
    const domain: undefined;
    const status: string;
    const online: boolean;
    const subscriptions: never[];
    const subscription: undefined;
    const buddies: never[];
}
//# sourceMappingURL=temporary.d.ts.map