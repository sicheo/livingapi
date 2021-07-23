import { Brouser } from "./brouser";
import { JwtApi } from "./factories/jwtapi";
import { JwtConnection } from "./factories/connections";
import * as Conv from "@convergence/convergence"

const prompt = require('prompt-sync')();

function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const buddytest = async function () {
    const convergenceurl = "http://192.168.1.156/api/realtime/convergence/living"
    const baseapihurl = "http://127.0.0.1:3132/living/v1/convergence"

   

    const jwtapi = new JwtApi(baseapihurl)


    //token = getToken()
    const jwtconn = new JwtConnection(convergenceurl, jwtapi)
    const userjwt = new Brouser("eleonora.decaroli@livingnet.eu", jwtconn)


    userjwt.emitter.on("connected", async (userpwd: any) => {
        console.log("EVENT: " + userjwt.id + " connected")
    })

    userjwt.emitter.on("disconnected", (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    userjwt.emitter.on("error", (error: any) => {
        console.log("ERROR: " + userjwt.id + " " + error)
    })


    userjwt.emitter.on(Conv.PresenceStateSetEvent.NAME, (ret) => {
        console.log("EVENT: " + userjwt.id + " statuschange: " + JSON.stringify(ret))
    })

    userjwt.emitter.on(Conv.PresenceAvailabilityChangedEvent.NAME, (ret) => {
        console.log("EVENT: " + userjwt.id + " availabilitychange: " + JSON.stringify(ret))
    })

    console.log("    6)Test subscriptions & unsubscription")

    try {
        await userjwt.connect({ user: "eleonora.decaroli@livingnet.eu", password: "password" })
        await sleep(1000)
        console.log("session id: " + userjwt.getSessionId())
        await userjwt.subscribe()
        /*
        prompt('press any key');
        userjwt.unsubscribeAll()
        if (userjwt.isConnected())
            await userjwt.disconnect()*/
    } catch (error) { console.log(error) }


}

buddytest();