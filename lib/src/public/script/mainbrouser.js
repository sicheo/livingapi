"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const brouser_1 = require("./brouser");
const connections_1 = require("./connections");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getToken() {
    const JwtGenerator = require('@convergence/jwt-util');
    const fs = require('fs');
    const path = require('path');
    const pkfile = path.join(__dirname, '/../../conf/pkliving.key');
    let privateKey = "";
    const keyId = "jwtliving070920";
    try {
        privateKey = fs.readFileSync(pkfile);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
    const gen = new JwtGenerator(keyId, privateKey);
    const claims = { firstName: "John", lastName: "Doe" };
    const username = "jdoe";
    const token = gen.generate(username, claims);
    return token;
}
const main = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const anonurl = "http://192.168.1.70/api/realtime/convergence/living";
        const anonconn = new connections_1.AnonymousConnection(anonurl);
        const pwconn = new connections_1.PasswordConnection(anonurl, "giulio.stumpo@gmail.com", "password");
        const token = getToken();
        const jwtconn = new connections_1.JwtConnection(anonurl, token);
        const useranon = new brouser_1.Brouser("Anonymous Connection", anonconn);
        const userpwd = new brouser_1.Brouser("Password Connection", pwconn);
        const userjwt = new brouser_1.Brouser("JWT Connection", jwtconn);
        useranon.emitter.on("connected", (id) => {
            console.log("EVENT: " + id + " connected");
        });
        useranon.emitter.on("disconnected", (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        userpwd.emitter.on("connected", (id) => {
            console.log("EVENT: " + id + " connected");
        });
        userpwd.emitter.on("disconnected", (id) => {
            console.log("EVENT: " + id + " disconnected");
        });
        let domain = undefined;
        useranon.connect()
            .then((dom) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            domain = dom;
            yield sleep(3000);
            yield useranon.disconnect(domain);
            userpwd.connect()
                .then((dom) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                domain = dom;
                yield sleep(3000);
                yield userpwd.disconnect(domain);
                userjwt.connect()
                    .then((dom) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    domain = dom;
                    yield sleep(3000);
                    yield userjwt.disconnect(domain);
                }))
                    .catch((error) => {
                    console.log(error);
                });
            }))
                .catch((error) => {
                console.log(error);
            });
        }))
            .catch((error) => {
            console.log(error);
        });
    });
};
main();
