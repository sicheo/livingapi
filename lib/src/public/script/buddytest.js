"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const brouser_1 = require("./brouser");
const jwtapi_1 = require("./factories/jwtapi");
const connections_1 = require("./factories/connections");
const Conv = tslib_1.__importStar(require("@convergence/convergence"));
const prompt = require('prompt-sync')();
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const buddytest = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const convergenceurl = "http://192.168.1.156/api/realtime/convergence/living";
        const baseapihurl = "http://127.0.0.1:3132/living/v1/convergence";
        const jwtapi = new jwtapi_1.JwtApi(baseapihurl);
        //token = getToken()
        const jwtconn = new connections_1.JwtConnection(convergenceurl, jwtapi);
        const userjwt = new brouser_1.Brouser("eleonora.decaroli@livingnet.eu", jwtconn);
        userjwt.emitter.on("connected", (userpwd) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + userjwt.id + " connected");
        }));
        userjwt.emitter.on("disconnected", (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        userjwt.emitter.on("error", (error) => {
            console.log("ERROR: " + userjwt.id + " " + error);
        });
        userjwt.emitter.on(Conv.PresenceStateSetEvent.NAME, (ret) => {
            console.log("EVENT: " + userjwt.id + " statuschange: " + JSON.stringify(ret));
        });
        userjwt.emitter.on(Conv.PresenceAvailabilityChangedEvent.NAME, (ret) => {
            console.log("EVENT: " + userjwt.id + " availabilitychange: " + JSON.stringify(ret));
        });
        console.log("    6)Test subscriptions & unsubscription");
        try {
            yield userjwt.connect({ user: "eleonora.decaroli@livingnet.eu", password: "password" });
            yield sleep(1000);
            console.log("session id: " + userjwt.getSessionId());
            yield userjwt.subscribe();
            /*
            prompt('press any key');
            userjwt.unsubscribeAll()
            if (userjwt.isConnected())
                await userjwt.disconnect()*/
        }
        catch (error) {
            console.log(error);
        }
    });
};
buddytest();
