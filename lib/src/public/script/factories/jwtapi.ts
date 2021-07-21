import { UserPersistenceApi } from "../interfaces/interfaces";

const axios = require('axios').default;

export class JwtApi implements UserPersistenceApi {
    private _token: undefined
    private _baseurl: string

    constructor(url: string) {
        this._baseurl = url
    }

    /**** API CALLS TO PERSISTENCE SERVER ***/

    /**
     * autenticate with userid/password
     * @param opts : {user:user,password:password}
     * @returns Promise<authtoken>
     */
    authenticate(opts: any): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.post(this._baseurl+'/token', {
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

    getBuddyList(url: string): Promise<any>{
        const auth = 'Bearer ' + this._token
        return new Promise((resolve, reject) => {
            axios.get(this._baseurl+url, {
                headers: {
                    'authorization': auth
                }
            })
            .then((response: any) => {
                resolve(response.data);
            })
            .catch(function (error: any) {
                   reject(error)

            })

        })
    }

}