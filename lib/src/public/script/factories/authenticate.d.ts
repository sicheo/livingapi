import { UserAuthenticate } from "../interfaces/interfaces";
export declare class JwtAuthentication implements UserAuthenticate {
    private _token;
    private _url;
    constructor(url: string);
    authenticate(opts: any): Promise<any>;
}
//# sourceMappingURL=authenticate.d.ts.map