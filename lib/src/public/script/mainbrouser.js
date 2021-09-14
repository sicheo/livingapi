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
const main = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const convergenceurl = "http://80.211.35.126:8000/api/realtime/convergence/living";
        const baseapihurl = "http://127.0.0.1:3132/living/v1/convergence";
        let token;
        const jwtapi = new jwtapi_1.JwtApi(baseapihurl);
        const anonconn = new connections_1.AnonymousConnection(convergenceurl);
        const pwconn = new connections_1.PasswordConnection(convergenceurl, "giulio.stumpo@gmail.com", "giulio2");
        //token = getToken()
        const jwtconn = new connections_1.JwtConnection(convergenceurl, jwtapi);
        const useranon = new brouser_1.Brouser("Anonymous Connection", anonconn);
        const userpwd = new brouser_1.Brouser("Password Connection", pwconn);
        const userjwt = new brouser_1.Brouser("giulio.stumpo@gmail.com", jwtconn);
        // set event listeners
        useranon.emitter.on(Conv.ConnectedEvent.NAME, (ret) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + useranon.id + " connected: ");
        }));
        useranon.emitter.on("disconnected", (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        useranon.emitter.on("error", (error) => {
            console.log("ERROR: " + useranon.id + " " + error);
        });
        userpwd.emitter.on(Conv.ConnectedEvent.NAME, (ret) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + ret.user + " connected: session " + ret.session);
        }));
        userpwd.emitter.on("disconnected", (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        userpwd.emitter.on("error", (error) => {
            console.log("ERROR: " + userpwd.id + " " + error);
        });
        userjwt.emitter.on(Conv.ConnectedEvent.NAME, (res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + userjwt.id + " connected: " + JSON.stringify(res));
        }));
        userjwt.emitter.on("disconnected", (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        userjwt.emitter.on("error", (error) => {
            console.log("ERROR: " + userjwt.id + " " + error);
        });
        // start test
        console.log("    1)Test anonymous connection");
        try {
            yield useranon.connect();
            yield sleep(3000);
            if (useranon.isConnected())
                yield useranon.disconnect();
        }
        catch (error) {
            console.log(error);
        }
        console.log("    2)Test password connection");
        try {
            yield userpwd.connect();
            yield sleep(3000);
            //if (userpwd.isConnected())
            yield userpwd.disconnect();
        }
        catch (error) {
            console.log(error);
        }
        console.log("    3)Test jwt connection");
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(3000);
            //if (userjwt.isConnected())
            yield userjwt.disconnect();
        }
        catch (error) {
            console.log(error);
        }
        console.log("    4)Test jwt re-connection");
        try {
            yield userjwt.connect();
            yield sleep(3000);
            //if (userjwt.isConnected())
            yield userjwt.disconnect();
        }
        catch (error) {
            console.log(error);
        }
        userjwt.emitter.on(Conv.PresenceStateSetEvent.NAME, (ret) => {
            console.log("EVENT: " + userjwt.id + " statuschange: " + JSON.stringify(ret));
        });
        console.log("    6)Test subscriptions & unsubscription");
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            console.log("session id: " + userjwt.getSessionId());
            prompt('press any key');
            yield userjwt.subscribe();
            userjwt.status = "dnd";
            yield sleep(1000);
            prompt('press any key');
            userjwt.status = "available";
            yield sleep(1000);
            prompt('press any key');
            yield userjwt.unsubscribeAll();
            if (userjwt.isConnected())
                yield userjwt.disconnect();
        }
        catch (error) {
            console.log(error);
        }
    });
};
main();
