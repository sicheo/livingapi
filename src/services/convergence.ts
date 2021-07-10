// convergence.ts
/**
 * This is the doc comment for convergence.ts <br>
 * Version 1.0.0 - 2020-08-17 <br>
 * author P. Pulicani <br>
 * use https://github.com/thiagobustamante/typescript-rest <br>
 *  @packageDocumentation
 *  
 */


import { Path, GET, POST, FormParam, Context, ServiceContext } from "typescript-rest";


/***********************************************
 * WARNING - CLASS INSTANCE THROUGH TYPESCRIPT-REST
 * CHECK IF INSTANCE STATUS IS THE SAME FOR DIFFERENR CALLS
 * 
 ***********************************************/


// *** AGENT SERVICE CLASS ***
@Path("/living/v1/convergence")
//@Security()
export class ConvergenceService {
    @Context
    context!: ServiceContext;

    

    constructor(opts?: any) {
        
    }

    private generateJwt(user: string): string {
        const fs = require('fs')
        const JwtGenerator = require('@convergence/jwt-util')
        const path = require('path')

        const confpath = path.join(__dirname, '/../conf/pkliving.key')
        try {
            var privateKey = fs.readFileSync(confpath)
        } catch (error) {
            this.context.request.app.locals.LOGGER.error(error)
            console.log(error)
        }

        const keyId = ""

        const gen = new JwtGenerator(keyId, privateKey)

        const token = gen.generate(user)

        return token
    }

    @GET
    getServer(): Promise<any> {
        return new Promise((resolve, reject) => {
            const agres = { result: "", body: "" }
            agres.result = 'OK'
            agres.body = "convergence"
            resolve(agres);
        });
    }

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
    @POST
    @Path("login")
    login(@FormParam("email") email: string, @FormParam("password") password: string ): Promise<any> {
        return new Promise((resolve, reject) => {
            if (email != this.context.request.app.locals.GAGENTUSER || password != this.context.request.app.locals.GAGENTPWD)
                reject("Bad userid or password")
            // add token to response hader
            const authorization = 'Bearer ' + this.generateJwt(email);
            //console.log(this.context.response)
            this.context.response.append("authorization", authorization)
            resolve("Logged in ")
        });
    }

}





