import request from 'supertest'
import { Express } from 'express-serve-static-core'
import { ApiServer } from '@App/apisrv'

let server: Express

let token = ''

let user:any



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

describe('UNIT-TEST API SERVER', () => {

    it('/living/v1/mock: should return 200', async () => {
        const response = await request(server)
            .get(`/living/v1/mock`)
        expect(response.statusCode).toBe(200)
    })


    it('/living/v1/convergence/login: should return 200', async () => {
        const params = {
            email: "giulio.stumpo@gmail.com",
            password: "giulio2"
        };
        const response = await request(server)
            .post(`/living/v1/convergence/login`)
            .send(params)
        token = response.headers['authorization']
        expect(response.statusCode).toBe(200)
    })

    it('/living/v1/convergence/buddies: should return 200', async () => {
        const response = await request(server)
            .get(`/living/v1/convergence/buddies/giulio.stumpo@gmail.com`)
            .auth(token.split(" ")[1], { type: 'bearer' })
        expect(response.statusCode).toBe(200)
    })

    it('/living/v1/convergence/adduser: should return 200', async () => {
        const params = {
            firstname: "pluto",
            lastname: "pippo",
            primary_bio: "",
            secondary_bio: "",
            secondary_bio_language: "IT",
            usertype: 1,
            username: "pluto",
            email: "pluto@pippo.com",
            email_verified_at: null,
            password: "oldpassword",
            completed: 0,
            active: 1,
            is_admin: 0,
            remember_token: ""
        };
        const response = await request(server)
            .post(`/living/v1/convergence/adduser`)
            .auth(token.split(" ")[1], { type: 'bearer' })
            .send(params)
        expect(response.statusCode).toBe(200)
    })

    it('/living/v1/convergence/newpasswd: should return 200', async () => {
        const params = {
            email: "pluto@pippo.com",
            password: "newpassword"
        };
        const response = await request(server)
            .post(`/living/v1/convergence/newpasswd`)
            .auth(token.split(" ")[1], { type: 'bearer' })
            .send(params)
        expect(response.statusCode).toBe(200)
    })

    it('/living/v1/convergence/getuser: should return 200', async () => {
        const response = await request(server)
            .get(`/living/v1/convergence/getuser/pluto@pippo.com`)
            .auth(token.split(" ")[1], { type: 'bearer' })
        user = response.body
        console.log(user)
        expect(response.statusCode).toBe(200)
    })

    it('/living/v1/convergence/updateuser: should return 200', async () => {
        //user.primary_bio ="new primary bio"
        const response = await request(server)
            .post(`/living/v1/convergence/updateuser`)
            .auth(token.split(" ")[1], { type: 'bearer' })
            .send(user)
        expect(response.statusCode).toBe(200)
    })

    
    it('/living/v1/convergence/deluser: should return 200', async () => {
        const params = {
            email: "pluto@pippo.com"
        };
        const response = await request(server)
            .post(`/living/v1/convergence/deluser`)
            .auth(token.split(" ")[1], { type: 'bearer' })
            .send(params)
        expect(response.statusCode).toBe(200)
    })

})
