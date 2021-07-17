import { Brouser } from "./brouser";
import { JwtAuthentication } from "./factories/authenticate";
import { AnonymousConnection, PasswordConnection, JwtConnection } from "./factories/connections";



function sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getToken() {
    const JwtGenerator = require('@convergence/jwt-util');
    const fs = require('fs');
    const path = require('path');
    const pkfile = path.join(__dirname, '/../../conf/pkliving.key')
    let privateKey = ""
    const keyId = "jwtliving070920";

    try {
        privateKey = fs.readFileSync(pkfile);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
    const gen = new JwtGenerator(keyId, privateKey);
    const claims = { firstName: "Giulio", lastName: "Stumpo", email:"giulio.stumpo@gmail.com" };
    const username = "giulio.stumpo@gmail.com";
    const token = gen.generate(username, claims);
    return token
}

const main = async function () {
    const convergenceurl = "http://192.168.43.26/api/realtime/convergence/living"
    const authurl = "http://127.0.0.1:3132/living/v1/convergence/token"

    let token: string | undefined

    const authconn = new JwtAuthentication(authurl)



    const anonconn = new AnonymousConnection(convergenceurl)
    const pwconn = new PasswordConnection(convergenceurl, "giulio.stumpo@gmail.com", "password")

    //token = getToken()
    const jwtconn = new JwtConnection(convergenceurl, authconn)

   


    const useranon = new Brouser("Anonymous Connection", anonconn)
    const userpwd = new Brouser("Password Connection", pwconn)
    const userjwt = new Brouser("JWT Connection", jwtconn)

   // set event listeners
    useranon.emitter.on("connected", async (domain:any) => {
        console.log("EVENT: " + useranon.id + " connected")
    })

    useranon.emitter.on("disconnected", (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    useranon.emitter.on("error", (error: any) => {
        console.log("ERROR: " + useranon.id + " " + error)
    })

    userpwd.emitter.on("connected",async (domain: any) => {
        console.log("EVENT: " + userpwd.id + " connected")
    })

    userpwd.emitter.on("disconnected", (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    userpwd.emitter.on("error", (error: any) => {
        console.log("ERROR: " + userpwd.id+ " " + error)
    })

    userjwt.emitter.on("connected", async (userpwd: any) => {
        console.log("EVENT: " + userjwt.id + " connected")
    })

    userjwt.emitter.on("disconnected", (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    userjwt.emitter.on("error", (error: any) => {
        console.log("ERROR: " + userjwt.id + " " + error)
    })

    // start test
    console.log("    1)Test anonymous connection")
    try {
        await useranon.connect()
        await sleep(3000)
        if (useranon.isConnected())
            await useranon.disconnect()
    } catch (error) { }

    console.log("    2)Test password connection")
    try {
        await userpwd.connect()
        await sleep(3000)
        if (userpwd.isConnected())
            await userpwd.disconnect()
    } catch (error) { }

    console.log("    3)Test jwt connection")
    try {
        await userjwt.connect({ user: "giulio.stumpo@gmail.com", password:"password"})
        await sleep(3000)
        if (userjwt.isConnected())
            await userjwt.disconnect()
    } catch (error) { }

    console.log("    4)Test jwt re-connection")
    try {
        await userjwt.connect()
        await sleep(3000)
        if (userjwt.isConnected())
            await userjwt.disconnect()
    } catch (error) { }
    
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

}

main();