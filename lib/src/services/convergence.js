"use strict";
// convergence.ts
/**
 * This is the doc comment for convergence.ts <br>
 * Version 1.0.0 - 2020-08-17 <br>
 * author P. Pulicani <br>
 * use https://github.com/thiagobustamante/typescript-rest <br>
 *  @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvergenceService = void 0;
const tslib_1 = require("tslib");
const typescript_rest_1 = require("typescript-rest");
const buddiesControl_1 = require("../controllers/buddiesControl");
const usersControl_1 = require("../controllers/usersControl");
const Convergence = require("@convergence/convergence").Convergence;
const WebSocket = require('ws');
const fs = require("fs");
const path = require("path");
let authorization = '';
/***********************************************
 * WARNING - CLASS INSTANCE THROUGH TYPESCRIPT-REST
 * CHECK IF INSTANCE STATUS IS THE SAME FOR DIFFERENR CALLS
 *
 ***********************************************/
// *** CONVERGE SERVICE CLASS ***
let ConvergenceService = 
//@Security()
class ConvergenceService {
    constructor() {
        this.dbname = "livingdb.db";
        this.token = "";
    }
    generateJwt(user, keyId, role = "ROLE_USER") {
        const fs = require('fs');
        const JwtGenerator = require('@convergence/jwt-util');
        const path = require('path');
        const confpath = path.join(__dirname, '/../conf/pkliving.key');
        try {
            var privateKey = fs.readFileSync(confpath);
        }
        catch (error) {
            this.context.request.app.locals.LOGGER.error(error);
            console.log(error);
        }
        const gen = new JwtGenerator(keyId, privateKey);
        const claims = {
            auth: role,
            email: user
        };
        this.token = gen.generate(user, claims);
        this.context.request.app.locals.LASTTOKEN = this.token;
        return this.token;
    }
    getToken() {
        return new Promise((resolve, reject) => {
            this.context.response.append("Content-Type", "text/html; charset=UTF-8");
            this.context.request.app.locals.LOGGER.error(this.token);
            resolve(this.context.request.app.locals.LASTTOKEN);
        });
    }
    getLogin() {
        return new Promise((resolve, reject) => {
            this.context.response.append("Content-Type", "text/html; charset=UTF-8");
            const confpath = path.join(__dirname, "/../www/login.html");
            const login = fs.readFileSync(confpath, "utf8");
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
    getBuddies(email) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const buddies = yield new buddiesControl_1.LivingBuddiesController(confpath);
            buddies.getUserBuddies(email)
                .then((rows) => {
                resolve(rows);
            })
                .catch((err) => {
                reject();
            });
        }));
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
    login(email, password) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const luser = yield new usersControl_1.LivingUserController(confpath);
            this.context.response.append("Content-Type", "text/html; charset=UTF-8");
            luser.getUserLogin(email, password)
                .then((usrpass) => {
                // user logged in
                this.token = this.generateJwt(email, this.context.request.app.locals.KEY_ID);
                authorization = 'Bearer ' + this.token;
                // connect to CONVERGENCE SERVER
                const url = "http://" + this.context.request.app.locals.CONVHOST + ":" + this.context.request.app.locals.CONVPORT + "/api/realtime/convergence/living";
                console.log(url);
                Convergence.connect(url, email, password, {
                    webSocket: {
                        factory: (url) => new WebSocket(url, { rejectUnauthorized: false }),
                        class: WebSocket
                    }
                })
                    .then((domain) => {
                    console.log("Connection success");
                    this.context.response.append("authorization", authorization);
                    const confpath = path.join(__dirname, "/../www/home.html");
                    const home = fs.readFileSync(confpath, "utf8");
                    const mhome = home.replace('__HOLD_TOKEN__', authorization.split(" ")[1]);
                    const nhome = mhome.replace('__HOLD_USER__', email);
                    resolve(nhome);
                })
                    .catch((error) => {
                    this.context.request.app.locals.LOGGER.error(error);
                    const confpath = path.join(__dirname, "/../www/login.html");
                    const login = fs.readFileSync(confpath, "utf8");
                    resolve(login);
                });
            })
                .catch((err) => {
                this.context.request.app.locals.LOGGER.error(err);
                const confpath = path.join(__dirname, "/../www/login.html");
                const login = fs.readFileSync(confpath, "utf8");
                resolve(login);
            });
        }));
    }
    logout(_tp_token) {
        return new Promise((resolve, reject) => {
            this.context.request.logout();
            this.context.response.append("Content-Type", "text/html; charset=UTF-8");
            const confpath = path.join(__dirname, "/../www/login.html");
            const login = fs.readFileSync(confpath, "utf8");
            resolve(login);
        });
    }
};
tslib_1.__decorate([
    typescript_rest_1.Context,
    tslib_1.__metadata("design:type", typescript_rest_1.ServiceContext)
], ConvergenceService.prototype, "context", void 0);
tslib_1.__decorate([
    typescript_rest_1.GET,
    typescript_rest_1.Path("token"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "getToken", null);
tslib_1.__decorate([
    typescript_rest_1.GET,
    typescript_rest_1.Path("login"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "getLogin", null);
tslib_1.__decorate([
    typescript_rest_1.GET,
    typescript_rest_1.Path("buddies/:email"),
    typescript_rest_1.Security("ROLE_USER"),
    tslib_1.__param(0, typescript_rest_1.PathParam("email")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "getBuddies", null);
tslib_1.__decorate([
    typescript_rest_1.POST,
    typescript_rest_1.Path("login"),
    tslib_1.__param(0, typescript_rest_1.FormParam("email")),
    tslib_1.__param(1, typescript_rest_1.FormParam("password")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "login", null);
tslib_1.__decorate([
    typescript_rest_1.POST,
    typescript_rest_1.Path("logout"),
    tslib_1.__param(0, typescript_rest_1.FormParam("_token")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "logout", null);
ConvergenceService = tslib_1.__decorate([
    typescript_rest_1.Path("/living/v1/convergence")
    //@Security()
], ConvergenceService);
exports.ConvergenceService = ConvergenceService;
