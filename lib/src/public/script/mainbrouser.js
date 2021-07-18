"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const brouser_1 = require("./brouser");
const authenticate_1 = require("./factories/authenticate");
const connections_1 = require("./factories/connections");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const main = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const convergenceurl = "http://192.168.43.26/api/realtime/convergence/living";
        const authurl = "http://127.0.0.1:3132/living/v1/convergence/token";
        let token;
        const authconn = new authenticate_1.JwtAuthentication(authurl);
        const anonconn = new connections_1.AnonymousConnection(convergenceurl);
        const pwconn = new connections_1.PasswordConnection(convergenceurl, "giulio.stumpo@gmail.com", "password");
        //token = getToken()
        const jwtconn = new connections_1.JwtConnection(convergenceurl, authconn);
        const useranon = new brouser_1.Brouser("Anonymous Connection", anonconn);
        const userpwd = new brouser_1.Brouser("Password Connection", pwconn);
        const userjwt = new brouser_1.Brouser("JWT Connection", jwtconn);
        // set event listeners
        useranon.emitter.on("connected", (domain) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + useranon.id + " connected");
        }));
        useranon.emitter.on("disconnected", (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        useranon.emitter.on("error", (error) => {
            console.log("ERROR: " + useranon.id + " " + error);
        });
        userpwd.emitter.on("connected", (domain) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + userpwd.id + " connected");
        }));
        userpwd.emitter.on("disconnected", (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        userpwd.emitter.on("error", (error) => {
            console.log("ERROR: " + userpwd.id + " " + error);
        });
        userjwt.emitter.on("connected", (userpwd) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("EVENT: " + userjwt.id + " connected");
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
        catch (error) { }
        console.log("    2)Test password connection");
        try {
            yield userpwd.connect();
            yield sleep(3000);
            if (userpwd.isConnected())
                yield userpwd.disconnect();
        }
        catch (error) { }
        console.log("    3)Test jwt connection");
        try {
            yield userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "password" });
            yield sleep(3000);
            if (userjwt.isConnected())
                yield userjwt.disconnect();
        }
        catch (error) { }
        console.log("    4)Test jwt re-connection");
        try {
            yield userjwt.connect();
            yield sleep(3000);
            if (userjwt.isConnected())
                yield userjwt.disconnect();
        }
        catch (error) { }
        const userlist = ["carlotta.garlanda@livingnet.eu", "eleonora.decaroli@livingnet.eu"];
        userjwt.emitter.on("subscribed", (subscriptions) => {
            console.log("EVENT: " + userjwt.id + " subscribed");
        });
        console.log("    5)Test subscriptions not connected");
        try {
            yield userjwt.subscribe(userlist);
            yield sleep(3000);
            if (userjwt.isConnected())
                yield userjwt.disconnect();
        }
        catch (error) { }
        console.log("    6)Test subscriptions & unsubscription");
        userjwt.emitter.on("subscribed", (subscriptions) => {
            let subscribed = "";
            for (let i = 0; i < subscriptions.length; i++)
                subscribed += " " + subscriptions[i].user.username;
            console.log("EVENT: " + userjwt.id + " subscribed: " + subscribed);
        });
        userjwt.emitter.on("unsubscribed", (username) => {
            console.log("EVENT: " + userjwt.id + " unsubscribed: " + username);
        });
        try {
            yield userjwt.connect();
            yield userjwt.subscribe(userlist);
            yield sleep(3000);
            userjwt.unsubscribe("eleonora.decaroli@livingnet.eu");
            if (userjwt.isConnected())
                yield userjwt.disconnect();
        }
        catch (error) {
            console.log(error);
        }
        /*
        console.log("    4)Test password connection with wrong user")
        try {
            const pwconnerr = new PasswordConnection(anonurl, "giulio.stumpo1@gmail.com", "password")
            userpwd.connection = pwconnerr
            await userpwd.connect()
            await sleep(3000)
            if (userpwd.isConnected())
                await userpwd.disconnect()
        } catch (error) {}
    
        console.log("    5)Test set status")
        userjwt.connect()
            .then((d: any) => {
                userjwt.status = "dnd"
            })
            .catch((error) => {
    
            })*/
    });
};
main();
