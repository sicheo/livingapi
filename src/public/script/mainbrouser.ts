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
    useranon.emitter.on(Brouser.EVT_CONNECTED, async (ret: any) => {
        console.log("EVENT: " + useranon.id + " connected: ")
    })

    useranon.emitter.on(Brouser.EVT_DISCONNECTED, (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    useranon.emitter.on(Brouser.EVT_ERROR, (error: any) => {
        console.log("ERROR: " + useranon.id + " " + error)
    })

    userpwd.emitter.on(Brouser.EVT_CONNECTED, async (ret: any) => {
        console.log("EVENT: " + ret.user + " connected: session " + ret.session)
    })

    userpwd.emitter.on(Brouser.EVT_DISCONNECTED, (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    userpwd.emitter.on(Brouser.EVT_ERROR, (error: any) => {
        console.log("ERROR: " + userpwd.id+ " " + error)
    })

    userjwt.emitter.on(Brouser.EVT_CONNECTED, async (res: any) => {
        console.log("EVENT: " + userjwt.id + " connected: " + JSON.stringify(res))
    })

    userjwt.emitter.on(Brouser.EVT_DISCONNECTED, (id: any) => {
        console.log("EVENT: " + id + " disconnected")
    })

    userjwt.emitter.on(Brouser.EVT_ERROR, (error: any) => {
        console.log("ERROR: " + userjwt.id + " " + error)
    })

    userjwt.emitter.on(Brouser.EVT_ACTIVITYSESSIONLEFT, (res: any) => {
        console.log("Activity Session Left "+res.evt)
        //console.log(res.ret.user)
    })

    userjwt.emitter.on(Brouser.EVT_ACTIVITYSESSIONJOINED, (res: any) => {
        console.log("Activity Session Joined " +res.evt)
        //console.log(res.ret.user)
    })

    userjwt.emitter.on(Brouser.EVT_ACTIVITYSTATESET, (res: any) => {
        console.log("Activity State Set " +res.evt)
        //console.log(res.ret.user)
    })

    userjwt.emitter.on(Brouser.EVT_ACTIVITYSTATEREMOVED, (res: any) => {
        console.log("Activity State Removed " +res.evt)
        //console.log(res.ret.user)
    })

    userjwt.emitter.on(Brouser.EVT_ACTIVITYSTATECLEARED, (res: any) => {
        console.log("Activity State Cleared " +res.evt)
        //console.log(res.ret.user)
    })

    userjwt.emitter.on(Brouser.EVT_ACTIVITYLEFT, (res: any) => {
        console.log("Activity Left " +res.evt)
        //console.log(res.ret.user)
    })

    userjwt.emitter.on(Brouser.EVT_ACTIVITYDELETED, (res: any) => {
        console.log("Activity Deleted " +res.evt)
        //console.log(res.ret.user)
    })

    userjwt.emitter.on(Brouser.EVT_ACTIVITYFORCELEAVE, (res: any) => {
        console.log("Activity ForceLeave " +res.evt)
        //console.log(res.ret.user)
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

    

    userjwt.emitter.on(Brouser.EVT_PRESENCESTATE, (ret: any) => {
        console.log("EVENT: " + userjwt.id + " statuschange: " + JSON.stringify(ret.value))
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

    console.log("    7) Test activity")

    try {
        const perms = { "LivingGroup": ["join", "lurk", "view_state", "set_state"] }
        await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
        await sleep(1000)
        console.log("session id: " + userjwt.getSessionId())
        await userjwt.joinActivity("project", "Progetto1")
        await sleep(1000)
        await userjwt.setActivityState("workpakg1", "working")
        await sleep(1000)
        const ret = await userjwt.getActivityState("workpakg1")
        console.log("activity status: "+ret)
        await sleep(1000)
        await userjwt.setActivityPermissions("group", perms)
        await sleep(1000)
        const prm = await userjwt.getActivityPermissions("group")
        await sleep(1000)
        console.log("activity permissions " + prm)
        await userjwt.removeActivityState("workpakg1")
        await sleep(1000)
        await userjwt.setActivityState("workpakg1", "working")
        await sleep(1000)
        await userjwt.clearActivityState()
        await sleep(1000)
        await userjwt.leaveActivity()
        await sleep(1000)
        if (userjwt.isConnected())
            await userjwt.disconnect()
        await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
        await sleep(1000)
        console.log("session id: " + userjwt.getSessionId())
        await userjwt.joinActivity("project", "Progetto1")
        await sleep(1000)
        await userjwt.joinActivity("project", "Progetto1", false)
        await sleep(1000)
        await userjwt.removeActivity()
        await sleep(1000)
        if (userjwt.isConnected())
            await userjwt.disconnect()
    } catch (error) { console.log(error) }

}

main();