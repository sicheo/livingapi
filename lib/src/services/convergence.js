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
const usersControl_1 = require("../controllers/usersControl");
const fs = require("fs");
const path = require("path");
/***********************************************
 * WARNING - CLASS INSTANCE THROUGH TYPESCRIPT-REST
 * CHECK IF INSTANCE STATUS IS THE SAME FOR DIFFERENR CALLS
 *
 ***********************************************/
// *** COMVERGE SERVICE CLASS ***
let ConvergenceService = 
//@Security()
class ConvergenceService {
    constructor() {
        this.dbname = "livingdb.db";
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
        const token = gen.generate(user, claims);
        return token;
    }
    getLogin() {
        return new Promise((resolve, reject) => {
            this.context.response.append("Content-Type", "text/html; charset=UTF-8");
            const confpath = path.join(__dirname, "/../www/login.html");
            const login = fs.readFileSync(confpath, "utf8");
            resolve(login);
        });
    }
    getHome() {
        return new Promise((resolve, reject) => {
            this.context.response.append("Content-Type", "text/html; charset=UTF-8");
            const confpath = path.join(__dirname, "/../www/home.html");
            const home = fs.readFileSync(confpath, "utf8");
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
    login(email, password) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const confpath = path.join(__dirname, "/../data/", this.dbname);
            const luser = yield new usersControl_1.LivingUserController(confpath);
            this.context.response.append("Content-Type", "text/html; charset=UTF-8");
            luser.getUserLogin(email, password)
                .then((usrpass) => {
                const authorization = 'Bearer ' + this.generateJwt(email, this.context.request.app.locals.KEY_ID);
                this.context.response.append("authorization", authorization);
                const confpath = path.join(__dirname, "/../www/home.html");
                const home = fs.readFileSync(confpath, "utf8");
                resolve(home);
            })
                .catch((err) => {
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
    typescript_rest_1.Path("login"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "getLogin", null);
tslib_1.__decorate([
    typescript_rest_1.GET,
    typescript_rest_1.Path("home"),
    typescript_rest_1.Security("ROLE_USER"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "getHome", null);
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
