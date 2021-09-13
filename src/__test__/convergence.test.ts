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

describe('UNIT-TEST CONVERGENCE SERVER ', () => {
    it('useranon.connect should return', async () => {
        await expect(useranon.connect()).resolves.toBeDefined();
    })
})