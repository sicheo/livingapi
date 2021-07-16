import { Brouser } from "./brouser";
import { AnonymousConnection, PasswordConnection, JwtConnection } from "./connections";


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
    const claims = { firstName: "John", lastName: "Doe" };
    const username = "jdoe";
    const token = gen.generate(username, claims);
    return token
}

const main = async function () {
    const anonurl = "http://192.168.1.70/api/realtime/convergence/living"
    const anonconn = new AnonymousConnection(anonurl)
    const pwconn = new PasswordConnection(anonurl, "giulio.stumpo@gmail.com", "password")

    const token = getToken()
    const jwtconn = new JwtConnection(anonurl, token)


    const useranon = new Brouser("Anonymous Connection", anonconn)
    const userpwd = new Brouser("Password Connection", pwconn)
    const userjwt = new Brouser("JWT Connection", jwtconn)

   
    useranon.emitter.on("connected", (id:any) => {
        console.log("EVENT: "+id+" connected")
    })

    useranon.emitter.on("disconnected", (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    userpwd.emitter.on("connected", (id: any) => {
        console.log("EVENT: " + id + " connected")
    })

    userpwd.emitter.on("disconnected", (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    let domain = undefined
    useranon.connect()
        .then(async (dom: any) => {
            domain = dom
            await sleep(3000)
            await useranon.disconnect(domain)
            userpwd.connect()
                .then(async (dom: any) => {
                    domain = dom
                    await sleep(3000)
                    await userpwd.disconnect(domain)
                    userjwt.connect()
                        .then(async (dom: any) => {
                            domain = dom
                            await sleep(3000)
                            await userjwt.disconnect(domain)
                        })
                        .catch((error: any) => {
                            console.log(error)
                        })
                })
                .catch((error: any) => {
                    console.log(error)
                })
        })
        .catch((error: any) => {
            console.log(error)
        })


}

main();