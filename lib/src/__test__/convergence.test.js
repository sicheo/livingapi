"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const brouser_1 = require("../public/script/brouser");
const jwtapi_1 = require("../public/script/factories/jwtapi");
const connections_1 = require("../public/script/factories/connections");
const convergenceurl = "http://80.211.35.126:8000/api/realtime/convergence/living";
const baseapihurl = "http://127.0.0.1:3132/living/v1/convergence";
let token;
const jwtapi = new jwtapi_1.JwtApi(baseapihurl);
const anonconn = new connections_1.AnonymousConnection(convergenceurl);
const pwconn = new connections_1.PasswordConnection(convergenceurl, "giulio.stumpo@gmail.com", "giulio2");
const jwtconn = new connections_1.JwtConnection(convergenceurl, jwtapi);
const useranon = new brouser_1.Brouser("Anonymous Connection", anonconn);
const userpwd = new brouser_1.Brouser("Password Connection", pwconn);
const userjwt = new brouser_1.Brouser("giulio.stumpo@gmail.com", jwtconn);
beforeAll(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const path = require("path");
        const fs = require("fs");
        process.env.HOST = "127.0.0.1";
        process.env.HTTPS = 'NO';
        process.env.PORT = '3132';
    }
    catch (error) {
        console.log(error);
    }
}));
describe('UNIT-TEST CONVERGENCE SERVER ', () => {
    it('useranon.connect should return', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(useranon.connect()).resolves.toBeDefined();
    }));
});
