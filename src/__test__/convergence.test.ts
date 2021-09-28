import { Brouser } from "../public/script/brouser";
import { JwtApi } from "../public/script/factories/jwtapi";
import { AnonymousConnection, PasswordConnection, JwtConnection } from "../public/script/factories/connections";
import * as Conv from "@convergence/convergence"

const convergenceurl = "http://80.211.35.126:8000/api/realtime/convergence/living"
const baseapihurl = "http://127.0.0.1:3132/living/v1/convergence"
let token: string | undefined
const jwtapi = new JwtApi(baseapihurl)
const anonconn = new AnonymousConnection(convergenceurl)
const pwconn = new PasswordConnection(convergenceurl, "giulio.stumpo@gmail.com", "giulio2")
const jwtconn = new JwtConnection(convergenceurl, jwtapi)
const useranon = new Brouser("Anonymous Connection", anonconn)
const userpwd = new Brouser("Password Connection", pwconn)
const userjwt = new Brouser("giulio.stumpo@gmail.com", jwtconn)

function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

beforeAll(async () => {
    try {
        const path = require("path")
        const fs = require("fs")
        process.env.HOST = "127.0.0.1"
        process.env.HTTPS = 'NO'
        process.env.PORT = '3132'
    } catch (error) {
        console.log(error)
    }
})


describe('UNIT-TEST CONVERGENCE SERVER PRESENCE', () => {
    it('useranon.connect should throw exception', async () => {
        try {
            await expect(useranon.connect()).rejects.toThrow("Anonymous authentication is disabled for the requested domain.")
            //await sleep(500)
        } catch (error) { }
    })

    it('userpwd.connect should return connected', async () => {
        try {
            await expect(userpwd.connect()).resolves.toBeDefined()
            //await sleep(500)
            await userpwd.disconnect()
        } catch (error) { console.log(error)}
    })

    it('userjwt.connect should return connected', async () => {
        try {
            await expect(userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })).resolves.toBeDefined()
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { console.log(error) }
    })

    it('userjwt.connect (reconnection) should return connected', async () => {
        try {
            await expect(userjwt.connect()).resolves.toBeDefined()
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { console.log(error) }
    })

    it('userjwt.subscribe should return defined', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await expect(userjwt.subscribe()).resolves.toBeDefined()
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { console.log(error) }
    })

    it('userjwt.unsubscribe should return unsubscribed', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await userjwt.subscribe()
            //await sleep(500)
            await expect(userjwt.unsubscribeAll()).resolves.toEqual("unsubscribed")
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.searchUser should return defined', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await expect(userjwt.searchUser("carlotta.garlanda@livingnet.eu")).resolves.toBeDefined()
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.search should return defined', async () => {
        try {
            const query = { fields: ['firstName', 'lastName'], term: 'Carlotta', offset: 0, limit: 10, orderBy: { field: 'lastName', ascending: true } }
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await expect(userjwt.search(query)).resolves.toBeDefined()
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.getGroup should return defined', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await expect(userjwt.getGroup()).resolves.toBeDefined()
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

})

describe('UNIT-TEST CONVERGENCE SERVER ACTIVITY', () => {
    it('userjwt.joinActivity should return defined', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await expect(userjwt.joinActivity("project","Progetto1")).resolves.toBeDefined()
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.setActivityState should return "state setted"', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await userjwt.joinActivity("project", "Progetto1")
            //await sleep(500)
            await expect(userjwt.setActivityState("workpakg1", "working")).resolves.toBe("state setted")
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.getActivityState should return "working"', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await userjwt.joinActivity("project", "Progetto1")
            //await sleep(500)
            await expect(userjwt.getActivityState("workpakg1")).resolves.toBe("working")
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.removeActivityState should return "state removed"', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await userjwt.joinActivity("project", "Progetto1")
            //await sleep(500)
            await expect(userjwt.removeActivityState("workpakg1")).resolves.toBe("state removed")
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.clearActivityState should return "state cleared"', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await userjwt.joinActivity("project", "Progetto1")
            //await sleep(500)
            await expect(userjwt.clearActivityState()).resolves.toBe("state cleared")
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.setActivityPermissions should return "group permission set"', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await userjwt.joinActivity("project", "Progetto1")
            //await sleep(500)
            const perms = { "LivingGroup": ["join" , "lurk" , "view_state" , "set_state" ] }
            await expect(userjwt.setActivityPermissions("group",perms)).resolves.toBe("group permission set")
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.getActivityPermissions should return defined', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await userjwt.joinActivity("project", "Progetto1")
            //await sleep(500)
            await expect(userjwt.getActivityPermissions("group")).resolves.toBeDefined()
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    },10000)

    it('userjwt.leaveActivity should return "activity leaved"', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await userjwt.joinActivity("project", "Progetto1")
            //await sleep(500)
            await expect(userjwt.leaveActivity()).resolves.toBe("activity leaved")
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    })

    it('userjwt.removeActivity should return "activity removed"', async () => {
        try {
            await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
            //await sleep(500)
            await userjwt.joinActivity("project", "Progetto1")
            //await sleep(500)
            await expect(userjwt.removeActivity()).resolves.toBe("activity removed")
            //await sleep(500)
            await userjwt.disconnect()
        } catch (error) { }
    }, 10000)

    describe('UNIT-TEST CONVERGENCE SERVER CHAT', () => {
        it('userjwt.createRoomChat should return defined', async () => {
            try {
                await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
                //await sleep(500)
                await expect(userjwt.createRoomChat("TEST_ROOM","MY TOPIC")).resolves.toBeDefined()
                //await sleep(500)
                await userjwt.disconnect()
            } catch (error) { }
        })

        it('userjwt.chatJoin should return defined', async () => {
            try {
                await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
                //await sleep(500)
                await expect(userjwt.chatJoin("TEST_ROOM")).resolves.toBeDefined()
                //await sleep(500)
                await userjwt.disconnect()
            } catch (error) { }
        },10000)

        it('userjwt.chatSend should return defined', async () => {
            try {
                await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
                //await sleep(500)
                await expect(userjwt.chatSend("TEST_ROOM","This is a message")).resolves.toBeDefined()
                //await sleep(500)
                await userjwt.disconnect()
            } catch (error) { }
        })

        it('userjwt.createChannelChat should return defined', async () => {
            try {
                await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
                //await sleep(500)
                await expect(userjwt.createChannelChat("TEST_CHAN", "MY TOPIC PRIVATE", ["giulio.stumpo@gmail.com"])).resolves.toBeDefined()
                //await sleep(500)
                await userjwt.disconnect()
            } catch (error) { }
        })

        it('userjwt.chatJoin should return defined', async () => {
            try {
                await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
                //await sleep(500)
                await expect(userjwt.chatJoin("TEST_CHAN")).resolves.toBeDefined()
                //await sleep(500)
                await userjwt.disconnect()
            } catch (error) { }
        })

        it('userjwt.chatAdd should return defined', async () => {
            try {
                await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
                //await sleep(500)
                await expect(userjwt.chatAdd("TEST_CHAN","carlotta.garlanda@livingnet.eu")).resolves.toBeDefined()
                //await sleep(500)
                await userjwt.disconnect()
            } catch (error) { }
        },10000)

        it('userjwt.chatSend should return defined', async () => {
            try {
                await userjwt.connect({ user: "giulio.stumpo@gmail.com", password: "giulio2" })
                //await sleep(500)
                await expect(userjwt.chatSend("TEST_CHAN", "This is a message")).resolves.toBeDefined()
                //await sleep(500)
                await userjwt.disconnect()
            } catch (error) { }
        })

    })
})