"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const brouser_1 = require("./brouser");
const jwtapi_1 = require("./factories/jwtapi");
const connections_1 = require("./factories/connections");
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
        useranon.emitter.on(brouser_1.Brouser.EVT_CONNECTED, (ret) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + useranon.id + " connected: ");
        }));
        useranon.emitter.on(brouser_1.Brouser.EVT_DISCONNECTED, (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        useranon.emitter.on(brouser_1.Brouser.EVT_ERROR, (error) => {
            console.log("ERROR: " + useranon.id + " " + error);
        });
        userpwd.emitter.on(brouser_1.Brouser.EVT_CONNECTED, (ret) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + ret.user + " connected: session " + ret.session);
        }));
        userpwd.emitter.on(brouser_1.Brouser.EVT_DISCONNECTED, (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        userpwd.emitter.on(brouser_1.Brouser.EVT_ERROR, (error) => {
            console.log("ERROR: " + userpwd.id + " " + error);
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_CONNECTED, (res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + userjwt.id + " connected: " + JSON.stringify(res));
        }));
        userjwt.emitter.on(brouser_1.Brouser.EVT_DISCONNECTED, (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_ERROR, (error) => {
            console.log("ERROR: " + userjwt.id + " " + error);
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_ACTIVITYSESSIONLEFT, (res) => {
            console.log("Activity Session Left " + res.evt);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_ACTIVITYSESSIONJOINED, (res) => {
            console.log("Activity Session Joined " + res.evt);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_ACTIVITYSTATESET, (res) => {
            console.log("Activity State Set " + res.evt);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_ACTIVITYSTATEREMOVED, (res) => {
            console.log("Activity State Removed " + res.evt);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_ACTIVITYSTATECLEARED, (res) => {
            console.log("Activity State Cleared " + res.evt);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_ACTIVITYLEFT, (res) => {
            console.log("Activity Left " + res.evt);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_ACTIVITYDELETED, (res) => {
            console.log("Activity Deleted " + res.evt);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_ACTIVITYFORCELEAVE, (res) => {
            console.log("Activity ForceLeave " + res.evt);
            //console.log(res.ret.user)
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
        userjwt.emitter.on(brouser_1.Brouser.EVT_PRESENCESTATE, (ret) => {
            console.log("EVENT: " + userjwt.id + " statuschange: " + JSON.stringify(ret.value));
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
        console.log("    7) Test activity");
        try {
            const perms = { "LivingGroup": ["join", "lurk", "view_state", "set_state"] };
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            console.log("session id: " + userjwt.getSessionId());
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            yield userjwt.setActivityState("workpakg1", "working");
            yield sleep(1000);
            const ret = yield userjwt.getActivityState("workpakg1");
            console.log("activity status: " + ret);
            yield sleep(1000);
            yield userjwt.setActivityPermissions("group", perms);
            yield sleep(1000);
            const prm = yield userjwt.getActivityPermissions("group");
            yield sleep(1000);
            console.log("activity permissions " + prm);
            yield userjwt.removeActivityState("workpakg1");
            yield sleep(1000);
            yield userjwt.setActivityState("workpakg1", "working");
            yield sleep(1000);
            yield userjwt.clearActivityState();
            yield sleep(1000);
            yield userjwt.leaveActivity();
            yield sleep(1000);
            if (userjwt.isConnected())
                yield userjwt.disconnect();
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(1000);
            console.log("session id: " + userjwt.getSessionId());
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(1000);
            yield userjwt.joinActivity("project", "Progetto1", false);
            yield sleep(1000);
            yield userjwt.removeActivity();
            yield sleep(1000);
            if (userjwt.isConnected())
                yield userjwt.disconnect();
        }
        catch (error) {
            console.log(error);
        }
    });
};
main();
