"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const apisrv_1 = require("@App/apisrv");
let server;
let token = '';
beforeAll(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    process.env.HOST = "127.0.0.1";
    process.env.HTTPS = 'NO';
    process.env.PORT = '3132';
    const apiserver = yield new apisrv_1.ApiServer(["convergence", "mock"]);
    server = apiserver.getApp();
}));
describe('UNIT-TEST', () => {
    it('should return 200', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server)
            .get(`/living/v1/mock`);
        expect(response.statusCode).toBe(200);
    }));
    it('should return 200', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server)
            .get(`/living/v1/convergence`);
        expect(response.statusCode).toBe(200);
    }));
    it('should return 500', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const params = {
            username: "username",
            password: "password"
        };
        const response = yield supertest_1.default(server)
            .post(`/living/v1/convergence/login`)
            .send(params);
        expect(response.statusCode).toBe(500);
    }));
    it('should return 200', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const params = {
            email: "admin",
            password: "password"
        };
        const response = yield supertest_1.default(server)
            .post(`/living/v1/convergence/login`)
            .send(params);
        token = response.headers['authorization'];
        expect(response.statusCode).toBe(200);
    }));
});
