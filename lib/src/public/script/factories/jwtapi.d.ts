import { UserPersistenceApi } from "../interfaces/interfaces";
export declare class JwtApi implements UserPersistenceApi {
    private _token;
    private _baseurl;
    constructor(url: string);
    /**** API CALLS TO PERSISTENCE SERVER ***/
    /**
     * autenticate with userid/password
     * @param opts : {user:user,password:password}
     * @returns Promise<authtoken>
     */
    authenticate(opts: any): Promise<any>;
    getBuddyList(url: string): Promise<any>;
}
//# sourceMappingURL=jwtapi.d.ts.map