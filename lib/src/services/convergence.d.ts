/**
 * This is the doc comment for convergence.ts <br>
 * Version 1.0.0 - 2020-08-17 <br>
 * author P. Pulicani <br>
 * use https://github.com/thiagobustamante/typescript-rest <br>
 *  @packageDocumentation
 *
 */
import { ServiceContext } from "typescript-rest";
/***********************************************
 * WARNING - CLASS INSTANCE THROUGH TYPESCRIPT-REST
 * CHECK IF INSTANCE STATUS IS THE SAME FOR DIFFERENR CALLS
 *
 ***********************************************/
export declare class ConvergenceService {
    context: ServiceContext;
    private dbname;
    private generateJwt;
    getLogin(): Promise<any>;
    getHome(): Promise<any>;
    /**
     * **API call:**<p>
     * Type: POST<p>
     * [curl -d @conf.json -H "Content-Type: application/json" -X POST http://localhost:3000/server/login] (curl -d @lf.json -H "Content-Type: application/json" -X POST http://localhost:3000/server/login)<p>
     * User Login. The login form is a json object in the body of the request<p>
     * login.json format example<p>
     * ```
     *	{
     *
     *		"username": "username",
     *		"password": "password"
     *	}
     */
    login(email: string, password: string): Promise<any>;
    logout(_tp_token: string): Promise<any>;
}
//# sourceMappingURL=convergence.d.ts.map