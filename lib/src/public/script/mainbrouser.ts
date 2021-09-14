import { Brouser } from "./brouser";
import { JwtApi } from "./factories/jwtapi";
import { AnonymousConnection, PasswordConnection, JwtConnection } from "./factories/connections";
import * as Conv from "@convergence/convergence"

const prompt = require('prompt-sync')();

function sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async function () {
    const convergenceurl = "http://80.211.35.126:8000/api/realtime/convergence/living"
    const baseapihurl = "http://127.0.0.1:3132/living/v1/convergence"

    let token: string | undefined

    const jwtapi = new JwtApi(baseapihurl)



    const anonconn = new AnonymousConnection(convergenceurl)
    const pwconn = new PasswordConnection(convergenceurl, "giulio.stumpo@gmail.com", "giulio2")

    //token = getToken()
    const jwtconn = new JwtConnection(convergenceurl, jwtapi)

   


    const useranon = new Brouser("Anonymous Connection", anonconn)
    const userpwd = new Brouser("Password Connection", pwconn)
    const userjwt = new Brouser("giulio.stumpo@gmail.com", jwtconn)

    // set event listeners
    useranon.emitter.on(Conv.ConnectedEvent.NAME, async (ret: any) => {
        console.log("EVENT: " + useranon.id + " connected: ")
    })

    useranon.emitter.on("disconnected", (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    useranon.emitter.on("error", (error: any) => {
        console.log("ERROR: " + useranon.id + " " + error)
    })

    userpwd.emitter.on(Conv.ConnectedEvent.NAME, async (ret: any) => {
        console.log("EVENT: " + ret.user + " connected: session " + ret.session)
    })

    userpwd.emitter.on("disconnected", (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    userpwd.emitter.on("error", (error: any) => {
        console.log("ERROR: " + userpwd.id+ " " + error)
    })

    userjwt.emitter.on(Conv.ConnectedEvent.NAME, async (res: any) => {
        console.log("EVENT: " + userjwt.id + " connected: " + JSON.stringify(res))
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
    } catch (error) { console.log(error)}

    console.log("    2)Test password connection")
    try {
        await userpwd.connect()
        await sleep(3000)
        //if (userpwd.isConnected())
            await userpwd.disconnect()
    } catch (error) { console.log(error) }

    console.log("    3)Test jwt connection")
    try {
        await userjwt.connect({ user: "giulio.stumpo@gmail.com", password:"giulio2"})
        await sleep(3000)
        //if (userjwt.isConnected())
            await userjwt.disconnect()
    } catch (error) { console.log(error) }

    console.log("    4)Test jwt re-connection")
    try {
        await userjwt.connect()
        await sleep(3000)
        //if (userjwt.isConnected())
            await userjwt.disconnect()
    } catch (error) { console.log(error) }

    

    userjwt.emitter.on(Conv.PresenceStateSetEvent.NAME, (ret: any) => {
        console.log("EVENT: " + userjwt.id + " statuschange: " + JSON.stringify(ret))
    })

    console.log("    6)Test subscriptions & unsubscription")

    try {
        await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
        await sleep(1000)
        console.log("session id: " + userjwt.getSessionId())
        prompt('press any key');
        await userjwt.subscribe()
        userjwt.status = "dnd"
        await sleep(1000)
        prompt('press any key');
        userjwt.status = "available"
        await sleep(1000)
        prompt('press any key');
        await userjwt.unsubscribeAll()
        if (userjwt.isConnected())
            await userjwt.disconnect()
    } catch (error) { console.log(error) }


}

main();