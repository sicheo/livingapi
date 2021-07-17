// convergence.ts
/**
 * This is the doc comment for convergence.ts <br>
 * Version 1.0.0 - 2020-08-17 <br>
 * author P. Pulicani <br>
 * use https://github.com/thiagobustamante/typescript-rest <br>
 *  @packageDocumentation
 *  
 */


import { Path, GET, POST, FormParam, QueryParam,Context, Security, PathParam, Return, ServiceContext } from "typescript-rest";
import { LivingBuddiesController } from "../controllers/buddiesControl";
import { LivingUserController } from "../controllers/usersControl";

const Convergence = require("@convergence/convergence").Convergence
const WebSocket = require('ws')

const fs = require("fs")
const path = require("path")

let authorization = ''


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
    private token = ""
   

    public generateJwt(user: string, keyId: string,role ="ROLE_USER"): string {
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
        this.token = gen.generate(user, claims)
        this.context.request.app.locals.LASTTOKEN = this.token
        return this.token
    }

    @POST
    @Path("token")
    getToken(config:any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const confpath = path.join(__dirname, "/../data/", this.dbname)
            const luser = await new LivingUserController(confpath)
            this.context.response.append("Content-Type", "application/json")
            luser.getUserLogin(config.email, config.password)
                .then((usrpass: any) => {
                    this.token = this.generateJwt(config.email, this.context.request.app.locals.KEY_ID)
                    authorization = 'Bearer ' + this.token
                    this.context.response.append("authorization", authorization)
                    resolve(this.token)
                })
                .catch((err: any) => {
                    this.context.request.app.locals.LOGGER.error("***ERROR****")
                    this.context.request.app.locals.LOGGER.error(JSON.stringify(err))
                    reject(err);
                })
        })
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

   /* @GET
    @Path("home")
    @Security("ROLE_USER")
    getHome(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.context.response.append("Content-Type", "text/html; charset=UTF-8")
            const confpath = path.join(__dirname, "/../www/home.html")
            const home = fs.readFileSync(confpath, "utf8")
            const mhome = home.replace('__HOLD_TOKEN__', authorization.split(" ")[1])
            const nhome = mhome.replace('__HOLD_USER__', email)
            resolve(nhome);
        });
    }*/

    @GET
    @Path("buddies/:email")
    @Security("ROLE_USER")
    getBuddies(@PathParam("email") email: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const confpath = path.join(__dirname, "/../data/", this.dbname)
            const buddies = await new LivingBuddiesController(confpath)
            buddies.getUserBuddies(email)
                .then((rows: any) => {
                    resolve (rows)
                })
                .catch((err: any) => {
                    reject()
                })
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
                    // user logged in
                    this.token = this.generateJwt(email, this.context.request.app.locals.KEY_ID)
                    authorization = 'Bearer ' + this.token
                    // connect to CONVERGENCE SERVER
                    const url = "http://" + this.context.request.app.locals.CONVHOST + ":" + this.context.request.app.locals.CONVPORT+"/api/realtime/convergence/living";
                    console.log(url)
                    Convergence.connect(url, email, password, {
                        webSocket: {
                            factory: (url:string) => new WebSocket(url, { rejectUnauthorized: false }),
                            class: WebSocket
                        }
                    })
                    .then((domain:any) => {
                            console.log("Connection success");
                        this.context.response.append("authorization", authorization)
                        const confpath = path.join(__dirname, "/../www/home.html")
                        const home = fs.readFileSync(confpath, "utf8")
                        const mhome = home.replace('__HOLD_TOKEN__', authorization.split(" ")[1])
                        const nhome = mhome.replace('__HOLD_USER__', email)
                            resolve(nhome);
                        })
                        .catch((error: any) => {
                            this.context.request.app.locals.LOGGER.error(error)
                            const confpath = path.join(__dirname, "/../www/login.html")
                            const login = fs.readFileSync(confpath, "utf8")
                            resolve(login);
                        })
                })
                .catch((err: any) => {
                    this.context.request.app.locals.LOGGER.error(err)
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





