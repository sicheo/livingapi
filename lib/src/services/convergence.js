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
/***********************************************
 * WARNING - CLASS INSTANCE THROUGH TYPESCRIPT-REST
 * CHECK IF INSTANCE STATUS IS THE SAME FOR DIFFERENR CALLS
 *
 ***********************************************/
// *** AGENT SERVICE CLASS ***
let ConvergenceService = 
//@Security()
class ConvergenceService {
    constructor(opts) {
    }
    generateJwt(user) {
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
        const keyId = "";
        const gen = new JwtGenerator(keyId, privateKey);
        const token = gen.generate(user);
        return token;
    }
    getServer() {
        return new Promise((resolve, reject) => {
            const agres = { result: "", body: "" };
            agres.result = 'OK';
            agres.body = "convergence";
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
    login(email, password) {
        return new Promise((resolve, reject) => {
            if (email != this.context.request.app.locals.GAGENTUSER || password != this.context.request.app.locals.GAGENTPWD)
                reject("Bad userid or password");
            // add token to response hader
            const authorization = 'Bearer ' + this.generateJwt(email);
            //console.log(this.context.response)
            this.context.response.append("authorization", authorization);
            resolve("Logged in ");
        });
    }
};
tslib_1.__decorate([
    typescript_rest_1.Context,
    tslib_1.__metadata("design:type", typescript_rest_1.ServiceContext)
], ConvergenceService.prototype, "context", void 0);
tslib_1.__decorate([
    typescript_rest_1.GET,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "getServer", null);
tslib_1.__decorate([
    typescript_rest_1.POST,
    typescript_rest_1.Path("login"),
    tslib_1.__param(0, typescript_rest_1.FormParam("email")),
    tslib_1.__param(1, typescript_rest_1.FormParam("password")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ConvergenceService.prototype, "login", null);
ConvergenceService = tslib_1.__decorate([
    typescript_rest_1.Path("/living/v1/convergence")
    //@Security()
    ,
    tslib_1.__metadata("design:paramtypes", [Object])
], ConvergenceService);
exports.ConvergenceService = ConvergenceService;
