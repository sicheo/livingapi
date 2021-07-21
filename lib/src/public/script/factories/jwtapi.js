"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtApi = void 0;
const axios = require('axios').default;
class JwtApi {
    constructor(url) {
        this._baseurl = url;
    }
    /**** API CALLS TO PERSISTENCE SERVER ***/
    /**
     * autenticate with userid/password
     * @param opts : {user:user,password:password}
     * @returns Promise<authtoken>
     */
    authenticate(opts) {
        return new Promise((resolve, reject) => {
            axios.post(this._baseurl + '/token', {
                email: opts.user,
                password: opts.password
            }).then((response) => {
                this._token = response.data;
                resolve(response.data);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    }
    getBuddyList(url) {
        const auth = 'Bearer ' + this._token;
        return new Promise((resolve, reject) => {
            axios.get(this._baseurl + url, {
                headers: {
                    'authorization': auth
                }
            })
                .then((response) => {
                resolve(response.data);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    }
}
exports.JwtApi = JwtApi;
