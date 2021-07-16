"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const buddiesControl_1 = require("../controllers/buddiesControl");
const usersControl_1 = require("../controllers/usersControl");
const Convergence = require("@convergence/convergence").Convergence;
const WebSocket = require('ws');
const fs = require("fs");
const jwt = require('jsonwebtoken');
const main = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log("***** TEST DB ***********");
        const path = require("path");
        const confpath = path.join(__dirname, "/../data/livingdb.db");
        console.log(confpath);
        const luser = yield new usersControl_1.LivingUserController(confpath);
        const buddies = yield new buddiesControl_1.LivingBuddiesController(confpath);
        var JwtGenerator = require('@convergence/jwt-util');
        try {
            const pathkey = path.join(__dirname, '/../conf/pkliving.key');
            const privateKey = fs.readFileSync(pathkey);
            var keyId = "jwtliving070920";
            var gen = new JwtGenerator(keyId, privateKey);
            var claims = { firstName: "Giulio", lastName: "Stumpo", email: "giulio.stumpo@living.com", auth: "ROLE_USER" };
            var username = "giulio.stumpo@living.com";
            var token = gen.generate(username, claims);
            console.log("");
            console.log("***** TEST USERS  ***********");
            luser.getUserLogin("giulio.stumpo@gmail.com", "password")
                .then((data) => {
                console.log(data);
            })
                .catch((err) => {
                console.log(err);
            });
            console.log("");
            console.log("***** TEST USERS  ***********");
            buddies.getUserBuddies("giulio.stumpo@gmail.com")
                .then((data) => {
                console.log(data);
            })
                .catch((err) => {
                console.log(err);
            });
            console.log("***** TEST CONVERGENCE  ***********");
            const url = "http://192.168.1.70/api/realtime/convergence/living";
            /*Convergence.connectWithJwt(url, token, {
                webSocket: {
                    factory: (url: string) => new WebSocket(url),
                    class: WebSocket
                }
            }).then((domain: any) => {
                console.log("Connection success");
                const pathpub = path.join(__dirname, '/../conf/public.key')
                const cert = fs.readFileSync(pathpub);  // get public key
                jwt.verify(token, cert, function (err: any, decoded: any) {
                    console.log(decoded) // bar
                });
            })
            .catch((error: any) => {
                console.log("Connection failed")
                console.log(error)
            })*/
            Convergence.connect(url, "giulio.stumpo@gmail.com", "password", {
                webSocket: {
                    factory: (url) => new WebSocket(url, { rejectUnauthorized: true }),
                    class: WebSocket
                }
            })
                .then((domain) => {
                console.log("Connection success");
                process.exit(0);
            })
                .catch((error) => {
                console.log("Connection failed");
                console.log(error);
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    });
};
main();
