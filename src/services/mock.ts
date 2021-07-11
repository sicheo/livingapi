// mock.ts
/**
 * This is the doc comment for mock.ts <br>
 * Version 1.0.0 - 2020-08-17 <br>
 * author P. Pulicani <br>
 * use https://github.com/thiagobustamante/typescript-rest <br>
 *  @packageDocumentation
 *  
 */


import { Path, GET, POST, QueryParam, Context, ServiceContext } from "typescript-rest";


/***********************************************
 * WARNING - CLASS INSTANCE THROUGH TYPESCRIPT-REST
 * CHECK IF INSTANCE STATUS IS THE SAME FOR DIFFERENR CALLS
 * 
 ***********************************************/


// *** MOCK SERVICE CLASS ***
@Path("/living/v1/mock")
export class MockService {
    @Context
    context!: ServiceContext;


    /**
     * **API call:**<p>
     * Type: POST<p>
     * [curl -d @conf.json -H "Content-Type: application/json" -X POST http://localhost:3000/server/login] (curl -d @lf.json -H "Content-Type: application/json" -X POST http://localhost:3000/server/login)<p>
     * Add agent to the server. The login form is a json object in the body of the request<p>
     * login.json format example<p>
     * ```
     *	{
     *	
     *		"username": "username",
     *		"password": "password"
     *	}
     */
    @GET
    getServer(): Promise<any> {
        return new Promise((resolve, reject) => {
            const agres = { result: "", body: "" }
            agres.result = 'OK'
            agres.body = "mock"
            resolve(agres);
        });
    }

}
