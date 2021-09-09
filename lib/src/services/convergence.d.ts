/**
 * This is the doc comment for convergence.ts <br>
 * Version 1.0.0 - 2020-08-17 <br>
 * author P. Pulicani <br>
 * use https://github.com/thiagobustamante/typescript-rest <br>
 *  @packageDocumentation
 *
 */
import { ServiceContext } from "typescript-rest";
export declare class ConvergenceService {
    /**
     * Summary: ConvergenceService() REST api for convergence.<p>
     *
     * Description: .
     *
     *
     * @private dbname: db
     * @private token: jwt
     */
    context: ServiceContext;
    private dbname;
    private token;
    generateJwt(user: string, keyId: string, role?: string): string;
    /**
    * **API call:**<p>
    * Type: POST<p>
    * [curl -d @conf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/token] (curl -d @lf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/token )<p>
    * Get JWT. The config parameter is a json object in the body of the request<p>
    * conf.json format example<p>
    * ```
    *	{
    *
    *		"email": "username",
    *		"password": "password"
    *	}
    */
    getToken(config: any): Promise<any>;
    /**
    * **API call:**<p>
    * Type: GET<p>
    * [curl -H "Content-Type: text/html" -X GET http://80.211.35.126:3132/living/v1/convergence/login] (curl  -H "Content-Type: text/html" -X GET http://80.211.35.126:3132/living/v1/convergence/login )<p>
    * Return the login page
    */
    getLogin(): Promise<any>;
    /**
    * **API call:**<p>
    * Type: GET<p>
    * [curl -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/buddies/email] (curl -d @lf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/buddies/email )<p>
    * Get the buddies list for userid=email<p>
    * The request must pass jwt in auth header.
    */
    getBuddies(email: string): Promise<any>;
    /**
     * **API call:**<p>
     * Type: POST<p>
     * [curl -d @conf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/login] (curl -d @lf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/login )<p>
     * User Login. The login form is a json object in the body of the request<p>
     * login.json format example<p>
     * ```
     *	{
     *
     *		"email": "username",
     *		"password": "password"
     *	}
     */
    login(email: string, password: string): Promise<any>;
    /**
     * **API call:**<p>
     * Type: POST<p>
     * [curl -d @conf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/adduser] (curl -d @lf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/adduser )<p>
     * Add user to user table. The user pramenter is a json object in the body of the request<p>
     * example<p>
     * ```
     *	{
     *
     *		firstname: "username",
     *		lastname: "password",
     *		primary_bio: "",
     *		secondary_bio: "",
     *		secondary_bio_language: "",
     *		usertype: "",
     *		username: "",
     *		email: "",
     *		email_verified_at": "",
     *		password: "",
     *		completed: 0,
     *		active: 1,
     *		is_admin: 0,
     *		remember_token: ""
     *
     *	}
     */
    adduser(user: any): Promise<any>;
    /**
     * **API call:**<p>
     * Type: POST<p>
     * [curl -d @conf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/deluser] (curl -d @lf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/deluser )<p>
     * Delete user from user table. The user pramenter is a json object in the body of the request<p>
     * example<p>
     * {
     *
     *		email: "user@mail"
     *	}
     */
    deluser(user: any): Promise<any>;
    /**
     * **API call:**<p>
     * Type: POST<p>
     * [curl -d @conf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/newpasswd] (curl -d @lf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/newpasswd )<p>
     * Delete user from user table. The user pramenter is a json object in the body of the request<p>
     * example<p>
     * {
     *
     *		email: "user@mail",
     *		password: "newpassword"
     *	}
     */
    newpasswd(user: any): Promise<any>;
    /**
    * **API call:**<p>
    * Type: GET<p>
    * [curl -H "Content-Type: text/html" -X GET http://80.211.35.126:3132/living/v1/convergence/logout] (curl  -H "Content-Type: text/html" -X GET http://80.211.35.126:3132/living/v1/convergence/logout )<p>
    * Return the login page
    */
    logout(): Promise<any>;
}
//# sourceMappingURL=convergence.d.ts.map