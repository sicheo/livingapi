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
const jwt_decode_1 = tslib_1.__importDefault(require("jwt-decode"));
const Convergence = require("@convergence/convergence").Convergence;
const WebSocket = require('ws');
const fs = require("fs");
const path = require("path");
let authorization = '';
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
        //this.context.request.app.locals.LASTTOKEN = this.token
        return this.token;
    }
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
    getToken(config) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const luser = yield new usersControl_1.LivingUserController(confpath);
            this.context.response.append("Content-Type", "application/json");
            luser.getUserLogin(config.email, config.password)
                .then((usrpass) => {
                this.token = this.generateJwt(config.email, this.context.request.app.locals.KEY_ID);
                authorization = 'Bearer ' + this.token;
                this.context.response.append("authorization", authorization);
                resolve(this.token);
            })
                .catch((err) => {
                this.context.request.app.locals.LOGGER.error("***ERROR****");
                this.context.request.app.locals.LOGGER.error(JSON.stringify(err));
                reject(err);
            });
        }));
    }
    /**
    * **API call:**<p>
    * Type: GET<p>
    * [curl -H "Content-Type: text/html" -X GET http://80.211.35.126:3132/living/v1/convergence/login] (curl  -H "Content-Type: text/html" -X GET http://80.211.35.126:3132/living/v1/convergence/login )<p>
    * Return the login page
    */
    getLogin() {
        return new Promise((resolve, reject) => {
            this.context.response.append("Content-Type", "text/html; charset=UTF-8");
            const confpath = path.join(__dirname, "/../www/login.html");
            const login = fs.readFileSync(confpath, "utf8");
            resolve(login);
        });
    }
    /**
    * **API call:**<p>
    * Type: GET<p>
    * [curl -H "Content-Type: application/json" -X GET http://80.211.35.126:3132/living/v1/convergence/buddies/:email] (curl --H "Content-Type: application/json" -X GET http://80.211.35.126:3132/living/v1/convergence/buddies/:email )<p>
    * Get the buddies list for userid=email<p>
    * The request must pass jwt in auth header.
    * Role: ROLE_ADMIN, ROLE_USER
    */
    getBuddies(email) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const buddies = yield new buddiesControl_1.LivingBuddiesController(confpath);
            buddies.getUserBuddies(email)
                .then((rows) => {
                resolve(rows);
            })
                .catch((err) => {
                this.context.request.app.locals.LOGGER.error(JSON.stringify(err));
                reject(err);
            });
        }));
    }
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
    login(email, password) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const luser = yield new usersControl_1.LivingUserController(confpath);
            this.context.response.append("Content-Type", "text/html; charset=UTF-8");
            luser.getUserLogin(email, password)
                .then((usrpass) => {
                let role = "ROLE_USER";
                if (usrpass.isAdmin > 0)
                    role = "ROLE_ADMIN";
                // user logged in
                this.token = this.generateJwt(email, this.context.request.app.locals.KEY_ID, role);
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
    adduser(user) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const luser = yield new usersControl_1.LivingUserController(confpath);
            luser.insertUser(user).then((rows) => {
                resolve(rows);
            })
                .catch((err) => {
                this.context.request.app.locals.LOGGER.error(JSON.stringify(err));
                reject(err);
            });
        }));
    }
    /**
     * **API call:**<p>
     * Type: POST<p>
     * [curl -d @conf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/updateuser] (curl -d @lf.json -H "Content-Type: application/json" -X POST http://80.211.35.126:3132/living/v1/convergence/updateuser )<p>
     * Update user. The user pramenter is a json object in the body of the request<p>
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
     *		password: "",
     *		completed: 0,
     *		active: 1,
     *		is_admin: 0,
     *
     *	}
     * The request must pass jwt in auth header.
     * Role: ROLE_ADMIN, ROLE_USER
     */
    updateuser(user) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const luser = yield new usersControl_1.LivingUserController(confpath);
            const token = this.context.request.get('authorization');
            let decoded;
            if (token == undefined)
                reject("update error: token undefined");
            else {
                decoded = jwt_decode_1.default(token.split(" ")[1]);
                const roles = decoded.auth.split(',');
                if ((decoded.email != user.email) && (!roles.includes("ROLE_ADMIN")))
                    reject("update error: not authorized");
                luser.insertUser(user).then((rows) => {
                    resolve(rows);
                })
                    .catch((err) => {
                    this.context.request.app.locals.LOGGER.error(JSON.stringify(err));
                    reject(err);
                });
            }
        }));
    }
    /**
     * **API call:**<p>
     * Type: POST<p>
     * [curl -H "Content-Type: application/json" -X GET http://80.211.35.126:3132/living/v1/convergence/getuser/email] (curl -H "Content-Type: application/json" -X GET http://80.211.35.126:3132/living/v1/convergence/getuser/email )<p>
     * Get the buddies list for userid=email<p>
     * The request must pass jwt in auth header.
     * Role: ROLE_ADMIN, ROLE_USER
     */
    getuser(email) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const luser = yield new usersControl_1.LivingUserController(confpath);
            const token = this.context.request.get('authorization');
            let decoded;
            if (token == undefined)
                reject("update error: token undefined");
            else {
                decoded = jwt_decode_1.default(token.split(" ")[1]);
                const roles = decoded.auth.split(',');
                if ((decoded.email != email) && (!roles.includes("ROLE_ADMIN")))
                    reject("update error: not authorized");
                luser.getUser(email).then((rows) => {
                    resolve(rows);
                })
                    .catch((err) => {
                    this.context.request.app.locals.LOGGER.error(JSON.stringify(err));
                    reject(err);
                });
            }
        }));
    }
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
     * The request must pass jwt in auth header.
     * Role: ROLE_ADMIN
     */
    deluser(user) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const luser = yield new usersControl_1.LivingUserController(confpath);
            luser.deletetUser(user.email).then((rows) => {
                resolve(rows);
            })
                .catch((err) => {
                this.context.request.app.locals.LOGGER.error(JSON.stringify(err));
                reject(err);
            });
        }));
    }
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
     * The request must pass jwt in auth header.
     * Role: ROLE_ADMIN, ROLE_USER
     */
    newpasswd(user) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const luser = yield new usersControl_1.LivingUserController(confpath);
            const token = this.context.request.get('authorization');
            let decoded;
            if (token == undefined)
                reject("change password error: token undefined");
            else {
                decoded = jwt_decode_1.default(token.split(" ")[1]);
                const roles = decoded.auth.split(',');
                if ((decoded.email != user.email) && (!roles.includes("ROLE_ADMIN")))
                    reject("change password error: not authorized");
                luser.changePassword(user.email, user.password).then((rows) => {
                    resolve(rows);
                })
                    .catch((err) => {
                    this.context.request.app.locals.LOGGER.error(JSON.stringify(err));
                    reject(err);
                });
            }
        }));
    }
    /**
    * **API call:**<p>
    * Type: GET<p>
    * [curl -H "Content-Type: text/html" -X GET http://80.211.35.126:3132/living/v1/convergence/logout] (curl  -H "Content-Type: text/html" -X GET http://80.211.35.126:3132/living/v1/convergence/logout )<p>
    * Return the login page
    */
    logout() {
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
    typescript_rest_1.POST,
    typescript_rest_1.Path("token"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
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
    typescript_rest_1.Security(["ROLE_ADMIN", "ROLE_USER"]),
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
    typescript_rest_1.Path("adduser"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "adduser", null);
tslib_1.__decorate([
    typescript_rest_1.POST,
    typescript_rest_1.Path("updateuser"),
    typescript_rest_1.Security(["ROLE_ADMIN", "ROLE_USER"]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "updateuser", null);
tslib_1.__decorate([
    typescript_rest_1.GET,
    typescript_rest_1.Path("getuser/:email"),
    typescript_rest_1.Security(["ROLE_ADMIN", "ROLE_USER"]),
    tslib_1.__param(0, typescript_rest_1.PathParam("email")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "getuser", null);
tslib_1.__decorate([
    typescript_rest_1.POST,
    typescript_rest_1.Path("deluser"),
    typescript_rest_1.Security("ROLE_ADMIN"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "deluser", null);
tslib_1.__decorate([
    typescript_rest_1.POST,
    typescript_rest_1.Path("newpasswd"),
    typescript_rest_1.Security(["ROLE_ADMIN", "ROLE_USER"]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "newpasswd", null);
tslib_1.__decorate([
    typescript_rest_1.GET,
    typescript_rest_1.Path("logout"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "logout", null);
ConvergenceService = tslib_1.__decorate([
    typescript_rest_1.Path("/living/v1/convergence")
    //@Security()
], ConvergenceService);
exports.ConvergenceService = ConvergenceService;
