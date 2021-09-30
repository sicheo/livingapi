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
        const convergenceurl = "ws://80.211.35.126:8000/api/realtime/convergence/living";
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
        const userjwt2 = new brouser_1.Brouser("carlotta.garlanda@livingnet.eu", jwtconn);
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
        userjwt2.emitter.on(brouser_1.Brouser.EVT_CONNECTED, (res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + userjwt.id + " connected: " + JSON.stringify(res));
        }));
        userjwt2.emitter.on(brouser_1.Brouser.EVT_DISCONNECTED, (id) => {
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
        userjwt.emitter.on(brouser_1.Brouser.EVT_CHATJOIN, (res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("Chat Join " + res.chatId);
            const info = yield userjwt.chatGetInfo(res.chatId);
            console.log(info);
            //console.log(res.ret.user)
        }));
        userjwt.emitter.on(brouser_1.Brouser.EVT_CHATLEFT, (res) => {
            console.log("Chat Left " + res.chatId);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_CHATMESSAGE, (res) => {
            console.log("Chat Message " + res.message);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_CHATNAMECHANGED, (res) => {
            console.log("Chat Change Name " + res.chatName);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_CHATREMOVED, (res) => {
            console.log("Chat Removed " + res.chatId);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_CHATTOPICCHANGED, (res) => {
            console.log("Chat Change Topic " + res.topic);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_CHATUSERLEFT, (res) => {
            console.log("Chat User Left ");
            console.log(res.ret);
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_CHATUSERADDED, (res) => {
            console.log("Chat Add User " + res.addedUser.username);
            //console.log(res.ret.user)
        });
        userjwt2.emitter.on(brouser_1.Brouser.EVT_CHATUSERADDED, (res) => {
            console.log("CG --> Chat Add User " + res.addedUser.username);
            //console.log(res.ret.user)
        });
        userjwt.emitter.on(brouser_1.Brouser.EVT_CHATUSERREMOVED, (res) => {
            console.log("Chat Remove User " + res.evt);
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
            yield sleep(500);
            console.log("session id: " + userjwt.getSessionId());
            prompt('press any key');
            yield userjwt.subscribe();
            userjwt.status = "dnd";
            yield sleep(500);
            prompt('press any key');
            userjwt.status = "available";
            yield sleep(500);
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
            yield sleep(500);
            console.log("session id: " + userjwt.getSessionId());
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(500);
            yield userjwt.setActivityState("workpakg1", "working");
            yield sleep(500);
            const ret = yield userjwt.getActivityState("workpakg1");
            console.log("activity status: " + ret);
            yield sleep(500);
            yield userjwt.setActivityPermissions("group", perms);
            yield sleep(500);
            const prm = yield userjwt.getActivityPermissions("group");
            yield sleep(500);
            console.log("activity permissions " + prm);
            yield userjwt.removeActivityState("workpakg1");
            yield sleep(500);
            yield userjwt.setActivityState("workpakg1", "working");
            yield sleep(500);
            yield userjwt.clearActivityState();
            yield sleep(500);
            yield userjwt.leaveActivity();
            yield sleep(500);
            if (userjwt.isConnected())
                yield userjwt.disconnect();
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(500);
            console.log("session id: " + userjwt.getSessionId());
            yield userjwt.joinActivity("project", "Progetto1");
            yield sleep(500);
            yield userjwt.joinActivity("project", "Progetto1", false);
            yield sleep(500);
            yield userjwt.removeActivity();
            yield sleep(500);
            if (userjwt.isConnected())
                yield userjwt.disconnect();
        }
        catch (error) {
            console.log(error);
        }
        console.log("    8) Test Chat");
        try {
            const perms = { "LivingGroup": ["join", "lurk", "view_state", "set_state"] };
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" });
            yield sleep(500);
            yield userjwt2.connect({ user: "carlotta.garlanda@livingnet.eu", password: "carlotta" });
            yield sleep(500);
            yield userjwt.createRoomChat("TEST_ROOM", "MY TOPIC");
            yield sleep(500);
            yield userjwt.chatJoin("TEST_ROOM");
            yield sleep(500);
            yield userjwt.chatSend("TEST_ROOM", "This is a message");
            yield sleep(500);
            yield userjwt.chatLeave("TEST_ROOM");
            yield sleep(500);
            yield userjwt.createChannelChat("TEST_CHAN", "MY TOPIC PRIVATE");
            yield sleep(500);
            //await userjwt.chatJoin("TEST_CHAN")
            yield userjwt.chatAdd("TEST_CHAN", "carlotta.garlanda@livingnet.eu");
            yield sleep(500);
            //await userjwt2.chatJoin("TEST_CHAN")
            //await sleep(500)
            yield userjwt.chatSend("TEST_CHAN", "This is a message from Giulio");
            yield userjwt2.chatSend("TEST_CHAN", "This is a message from Carlotta");
            //await userjwt.chatChangeName("TEST_CHAN", "NEW_NAME")
            yield userjwt.chatChangeTopic("TEST_CHAN", "NEW_TOPIC");
            yield userjwt.chatLeave("TEST_CHAN");
            if (userjwt.isConnected())
                yield userjwt.disconnect();
            if (userjwt2.isConnected())
                yield userjwt2.disconnect();
        }
        catch (error) {
            console.log(error);
            console.log(error._details);
            if (userjwt.isConnected())
                yield userjwt.disconnect();
            if (userjwt2.isConnected())
                yield userjwt2.disconnect();
        }
    });
};
main();
