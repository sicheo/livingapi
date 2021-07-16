import request from 'supertest'
import { Express } from 'express-serve-static-core'
import { ApiServer } from '@App/apisrv'

let server: Express

let token = ''



beforeAll(async () => {
    try {
        const path = require("path")
        const fs = require("fs")
        process.env.HOST = "127.0.0.1"
        process.env.HTTPS = 'NO'
        process.env.PORT = '3132'
        const apiserver = await new ApiServer(["convergence", "mock"])
        server = apiserver.getApp() as Express
    } catch (error) {
        console.log(error)
    }
})

describe('UNIT-TEST', () => {

    it('should return 200', async () => {
        const response = await request(server)
            .get(`/living/v1/mock`)
        expect(response.statusCode).toBe(200)
    })


    it('should return 200', async () => {
        const params = {
            email: "giulio.stumpo@gmail.com",
            password: "password"
        };
        const response = await request(server)
            .post(`/living/v1/convergence/login`)
            .send(params)
        token = response.headers['authorization']
        expect(response.statusCode).toBe(200)
    })

    it('should return 200', async () => {
        const response = await request(server)
            .get(`/living/v1/convergence/buddies/giulio.stumpo@gmail.com`)
            .auth(token.split(" ")[1], { type: 'bearer' })
        expect(response.statusCode).toBe(200)
    })

})
