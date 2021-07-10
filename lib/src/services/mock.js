"use strict";
// mock.ts
/**
 * This is the doc comment for mock.ts <br>
 * Version 1.0.0 - 2020-08-17 <br>
 * author P. Pulicani <br>
 * use https://github.com/thiagobustamante/typescript-rest <br>
 *  @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockService = void 0;
const tslib_1 = require("tslib");
const typescript_rest_1 = require("typescript-rest");
/***********************************************
 * WARNING - CLASS INSTANCE THROUGH TYPESCRIPT-REST
 * CHECK IF INSTANCE STATUS IS THE SAME FOR DIFFERENR CALLS
 *
 ***********************************************/
// *** AGENT SERVICE CLASS ***
let MockService = class MockService {
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
    getServer() {
        return new Promise((resolve, reject) => {
            const agres = { result: "", body: "" };
            agres.result = 'OK';
            agres.body = "mock";
            resolve(agres);
        });
    }
};
tslib_1.__decorate([
    typescript_rest_1.Context,
    tslib_1.__metadata("design:type", typescript_rest_1.ServiceContext)
], MockService.prototype, "context", void 0);
tslib_1.__decorate([
    typescript_rest_1.GET,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MockService.prototype, "getServer", null);
MockService = tslib_1.__decorate([
    typescript_rest_1.Path("/living/v1/mock")
], MockService);
exports.MockService = MockService;
