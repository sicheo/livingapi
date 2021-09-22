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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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
describe('UNIT-TEST CONVERGENCE SERVER PRESENCE', () => {
    it('useranon.connect should throw exception', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield expect(useranon.connect()).rejects.toThrow("Anonymous authentication is disabled for the requested domain.");
            yield sleep(3000);
        }
        catch (error) { }
    }));
    it('userpwd.connect should return connected', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield expect(userpwd.connect()).resolves.toBeDefined();
            yield sleep(3000);
            yield userpwd.disconnect();
        }
        catch (error) {
            console.log(error);
        }
    }));
    it('userjwt.connect should return connected', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield expect(userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })).resolves.toBeDefined();
            yield sleep(3000);
            yield userjwt.disconnect();
        }
        catch (error) {
            console.log(error);
        }
    }));
    it('userjwt.connect (reconnection) should return connected', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield expect(userjwt.connect()).resolves.toBeDefined();
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) {
            console.log(error);
        }
    }));
    it('userjwt.subscribe should return defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield expect(userjwt.subscribe()).resolves.toBeDefined();
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) {
            console.log(error);
        }
    }));
    it('userjwt.unsubscribe should return unsubscribed', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield userjwt.subscribe();
            yield sleep(1000);
            yield expect(userjwt.unsubscribeAll()).resolves.toEqual("unsubscribed");
            yield sleep(1000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.searchUser should return defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield expect(userjwt.searchUser("carlotta.garlanda@livingnet.eu")).resolves.toBeDefined();
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.search should return defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = { fields: ['firstName', 'lastName'], term: 'Carlotta', offset: 0, limit: 10, orderBy: { field: 'lastName', ascending: true } };
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield expect(userjwt.search(query)).resolves.toBeDefined();
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.getGroup should return defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield expect(userjwt.getGroup()).resolves.toBeDefined();
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
});
describe('UNIT-TEST CONVERGENCE SERVER ACTIVITY', () => {
    it('userjwt.joinActivity should return defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield expect(userjwt.joinActivity("project", "Progetto1")).resolves.toBeDefined();
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.setActivityState should return "state setted"', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            yield expect(userjwt.setActivityState("workpakg1", "working")).resolves.toBe("state setted");
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.getActivityState should return "working"', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            yield expect(userjwt.getActivityState("workpakg1")).resolves.toBe("working");
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.removeActivityState should return "state removed"', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            yield expect(userjwt.removeActivityState("workpakg1")).resolves.toBe("state removed");
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.clearActivityState should return "state cleared"', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            yield expect(userjwt.clearActivityState()).resolves.toBe("state cleared");
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.setActivityPermissions should return "group permission set"', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            const perms = { "LivingGroup": ["join", "lurk", "view_state", "set_state"] };
            yield expect(userjwt.setActivityPermissions("group", perms)).resolves.toBe("group permission set");
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.getActivityPermissions should return defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            yield expect(userjwt.getActivityPermissions("group")).resolves.toBeDefined();
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.leaveActivity should return "activity leaved"', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            yield expect(userjwt.leaveActivity()).resolves.toBe("activity leaved");
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }));
    it('userjwt.removeActivity should return "activity removed"', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            yield expect(userjwt.removeActivity()).resolves.toBe("activity removed");
            yield sleep(2000);
            yield userjwt.disconnect();
        }
        catch (error) { }
    }), 10000);
});
