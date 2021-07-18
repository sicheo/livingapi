import { Brouser } from "./brouser";
import { JwtAuthentication } from "./factories/authenticate";
import { AnonymousConnection, PasswordConnection, JwtConnection } from "./factories/connections";



function sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

    const userlist = ["carlotta.garlanda@livingnet.eu","eleonora.decaroli@livingnet.eu"]
    userjwt.emitter.on("subscribed", (subscriptions: any) => {
        console.log("EVENT: " + userjwt.id + " subscribed")
    })

    console.log("    5)Test subscriptions not connected")
    try {
        await userjwt.subscribe(userlist)
        await sleep(3000)
        if (userjwt.isConnected())
            await userjwt.disconnect()
    } catch (error) { }

    console.log("    6)Test subscriptions & unsubscription")

    userjwt.emitter.on("subscribed", (subscriptions: any) => {
        let subscribed = ""
        for (let i = 0; i < subscriptions.length; i++)
            subscribed += " " + subscriptions[i].user.username
        console.log("EVENT: " + userjwt.id + " subscribed: " + subscribed)
    })

    userjwt.emitter.on("unsubscribed", (username: string) => {
        console.log("EVENT: " + userjwt.id + " unsubscribed: " + username)
    })

    try {
        await userjwt.connect()
        await userjwt.subscribe(userlist)
        await sleep(3000)
        userjwt.unsubscribe("eleonora.decaroli@livingnet.eu")
        if (userjwt.isConnected())
            await userjwt.disconnect()
    } catch (error) { console.log(error)}
    
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