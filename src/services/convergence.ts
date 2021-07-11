// convergence.ts
/**
 * This is the doc comment for convergence.ts <br>
 * Version 1.0.0 - 2020-08-17 <br>
 * author P. Pulicani <br>
 * use https://github.com/thiagobustamante/typescript-rest <br>
 *  @packageDocumentation
 *  
 */


import { Path, GET, POST, FormParam, Context, Security, Return, ServiceContext } from "typescript-rest";
import { LivingUserController } from "../controllers/usersControl";

const fs = require("fs")
const path = require("path")



/***********************************************
 * WARNING - CLASS INSTANCE THROUGH TYPESCRIPT-REST
 * CHECK IF INSTANCE STATUS IS THE SAME FOR DIFFERENR CALLS
 * 
 ***********************************************/


// *** CONVERGE SERVICE CLASS ***
@Path("/living/v1/convergence")
//@Security()
export class ConvergenceService {
    @Context
    context!: ServiceContext;

    private dbname = "livingdb.db"
   

    private generateJwt(user: string, keyId: string,role ="ROLE_USER"): string {
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

        const gen = new JwtGenerator(keyId, privateKey)

        const claims = {
            auth: role,
            email: user
        }

        const token = gen.generate(user,claims)

        return token
    }

    @GET
    @Path("login")
    getLogin(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.context.response.append("Content-Type", "text/html; charset=UTF-8")
            const confpath = path.join(__dirname, "/../www/login.html")
            const login =  fs.readFileSync(confpath, "utf8")
            resolve(login);
        });
    }

    @GET
    @Path("home")
    @Security("ROLE_USER")
    getHome(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.context.response.append("Content-Type", "text/html; charset=UTF-8")
            const confpath = path.join(__dirname, "/../www/home.html")
            const home = fs.readFileSync(confpath, "utf8")
            resolve(home);
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
    login(@FormParam("email") email: string, @FormParam("password") password: string): Promise<any> {

        return new Promise(async (resolve, reject) => {
            const confpath = path.join(__dirname, "/../data/", this.dbname)
            const luser = await new LivingUserController(confpath)
            this.context.response.append("Content-Type", "text/html; charset=UTF-8")
            luser.getUserLogin(email, password)
                .then((usrpass: any) => {
                    const authorization = 'Bearer ' + this.generateJwt(email, this.context.request.app.locals.KEY_ID);
                    this.context.response.append("authorization", authorization)
                    const confpath = path.join(__dirname, "/../www/home.html")
                    const home = fs.readFileSync(confpath, "utf8")
                    resolve(home);
                })
                .catch((err: any) => {
                    const confpath = path.join(__dirname, "/../www/login.html")
                    const login = fs.readFileSync(confpath, "utf8")
                    resolve(login);
                })
        });
    }

    @POST
    @Path("logout")
    logout(@FormParam("_token") _tp_token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.context.request.logout()
            this.context.response.append("Content-Type", "text/html; charset=UTF-8")
            const confpath = path.join(__dirname, "/../www/login.html")
            const login = fs.readFileSync(confpath, "utf8")
            resolve(login);
        });
    }

}





