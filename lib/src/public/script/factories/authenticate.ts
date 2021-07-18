import { UserAuthenticate } from "../interfaces/interfaces";

const axios = require('axios').default;

export class JwtAuthentication implements UserAuthenticate {
    private _token: undefined
    private _url: string

    constructor(url: string) {
        this._url = url
    }

    authenticate(opts: any): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.post(this._url, {
                    email: opts.user,
                    password: opts.password   
            }).then( (response: any) => {
                    this._token = response.data
                    resolve(response.data);
                })
                .catch(function (error: any) {
                    reject(error)
                })

        })
    }
}