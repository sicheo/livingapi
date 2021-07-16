// apisrv.ts
/**
 * Define ApiServer class
 * @packageDocumentation
 */
import cors from 'cors';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import  morgan from 'morgan';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
//import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { PassportAuthenticator, Server } from 'typescript-rest';
import bodyParser from 'body-parser';
import _ from 'lodash'
import log4js from 'log4js'

export class ApiServer {
    public PORT: number = Number(process.env.PORT) || 3132;
    public HOST: string = process.env.HOST || "0.0.0.0";
    public CONVPORT: number = Number(process.env.PORT) || 80;
    public CONVHOST: string = process.env.HOST || "127.0.0.1";
    public HTTPS: string = process.env.HTTPS || "NO";
    public LOGLEVEL: string = process.env.LOGLEVEL || "error";
    public LOGFILE: string = process.env.LOGFILE || "apisrv.log";
    public LOGTYPE: string = process.env.LOGTYPE || "file";

    private readonly app: any;
    private readonly router: any;
    private server: http.Server | https.Server | null = null;
    private _logger: any | undefined = undefined

    private APIUSER: string = process.env.APIUSER || "admin"
    private APIPWD: string = process.env.APIPWD || "password"

    private JWT_SECRET = process.env.JWTOKEN || 'Bty3ndkOla2@ppSo3m';
    private KEY_ID = process.env.KEY_ID || 'myprivatekey'
    

    constructor(module:string[], confile: any="apisrv.json") {
        const appender = "apisrv"
        let opts = {
            HOST: "0.0.0.0",
            PORT: "3132",
            CONVHOST: "127.0.0.1",
            CONVPORT: "80",
            HTTPS: "NO",
            LOGTYPE: "file",
            USER: "admin",
            PASSWD: "password",
            JWT_SECRET: "BGyeoì29358nnDuIS193845hn@!",
            LOGFILE: "apisrv.log",
            KEY_ID: "myprivatekey"
        }

        // Read configuration file
        const confpath = path.join(__dirname, "/conf/", confile)
        const rawdata = fs.readFileSync(confpath, "utf8")
        opts = JSON.parse(rawdata)

        console.log(opts)

        // Assign configuration file values
        
        this.PORT = Number(opts.PORT)
        this.HOST = opts.HOST
        this.CONVPORT = Number(opts.CONVPORT)
        this.CONVHOST = opts.CONVHOST
        this.HTTPS = opts.HTTPS
        this.LOGTYPE = opts.LOGTYPE
        this.LOGFILE = opts.LOGFILE
        this.APIUSER = opts.USER
        this.APIPWD = opts.PASSWD
        this.KEY_ID = opts.KEY_ID

        // Build logger
        const logFile = __dirname + "/logs/" + this.LOGFILE
        let logopts = {
            appenders: {
                [appender]: {
                    type: this.LOGTYPE,
                    filename: logFile,
                    maxLogSize: 10485760,
                    backups: 3,
                    keepFileExt: true,
                    layout: { type: 'basic' }
                }
            },
            categories: {
                default: { appenders: [appender], level: this.LOGLEVEL }
            }
        }
        log4js.configure(logopts)

        this._logger = log4js.getLogger(appender);


        this.app = express()
        this.router = express.Router();

        //Server.useIoC();

        // Assign to locals
        this.app.locals.GAGENTUSER = this.APIUSER
        this.app.locals.GAGENTPWD = this.APIPWD
        this.app.locals.KEY_ID = this.KEY_ID
        this.app.locals.PORT = this.PORT
        this.app.locals.HOST = this.HOST
        this.app.locals.HTTPS = this.HTTPS
        this.app.locals.LOGGER = this._logger
        this.app.locals.CONVPORT = this.CONVPORT
        this.app.locals.CONVHOST = this.CONVHOST
        this.app.locals.LASTTOKEN = ""

       
        // Build service
        this.getModule(module)
            .then((mods) => {
                for (let i = 0; i < mods.length; i++) {
                    const values = Object.values(mods[i])
                    for (let j = 0; j < values.length; j++) {
                        Server.buildServices(this.app, values[j]);
                    }
                }
               
            })
            .catch((error) => {
                this._logger.error("Apiserver: Unable to load module")
                this._logger.error(error)
                process.exit(1)
            })
        //Server.swagger(this.app, { filePath: './dist/swagger.json' });

        this.config();
    }

    public getApp() {
        return this.app
    }

    public getRouter() {
        return this.router
    }

    // LOAD module
    private async getModule(module: any[]): Promise<[]> {
        return new Promise((resolve: any, reject: any) => {
            const modules: any[] = []
            for (let i = 0; i < module.length; i++) {
                const modulepath = "./services/" + module[i]
                import(modulepath).then((a) => {
                    modules.push(a)
                    if (i == module.length - 1)
                        resolve(modules)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }

    /**
     * Start the server
     * @returns {Promise<any>}
     */
    public async start() {
        return new Promise<any>((resolve, reject) => {
            this._logger.error("****       AGENT SERVER VER. 1.0      ***********")
            this._logger.error("*                                               *")
            this._logger.error("*               field automation                *")
            this._logger.error("*                  server.                      *")
            this._logger.error("*************************************************")
            this._logger.error("                                                 ")
            if (this.HTTPS =='YES') {
                this.server = https.createServer({
                    key: fs.readFileSync(__dirname+'/conf/key.pem'),
                    cert: fs.readFileSync(__dirname+'/conf/aiq.pem')
                }, this.app)
                    .listen(this.PORT, this.HOST, () => {

                        // TODO: replace with Morgan call
                        // tslint:disable-next-line:no-console
                        this._logger.error(`Listening to https://${this.HOST}:${this.PORT}`);

                        return resolve(this.server);
                    });
            }
            else {
                this.server = this.app.listen(this.PORT, this.HOST, () => {

                    // TODO: replace with Morgan call
                    // tslint:disable-next-line:no-console
                    this._logger.error(`Listening to http://${this.HOST}:${this.PORT}`);

                    return resolve(this.server);
                });

            }
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public async stop(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

    /**
     * Configure the express app.
     * uses cors, morgan, nodeinfo, passport-jwt,
     */
    private config(): void {
        // Native Express configuration
        this.app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(morgan('combined'));
        this.app.use(express.static('lib/src/public'))
        // CONFIGURE AUTHENTICATION
        this.configureAuthenticator();
        
    }

    private configureAuthenticator() {
        const confpath = path.join(__dirname, '/conf/pkliving.key')
        var privateKey: Buffer | undefined
        try {
            privateKey = fs.readFileSync(confpath)
        } catch (error) {
            this._logger.error(error)
            console.log(error)
        }

        const jwtConfig: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: privateKey,
            algorithms: ['RS256']
        };

        interface JwtUser {
            username: string;
            roles: Array<string>;
            strategy: string;
        }

        interface JwtUserPayload {
            email: string;
            auth: string;
        }

        const strategy = new Strategy(jwtConfig, (payload: JwtUserPayload, done: (a: null, b: JwtUser) => void) => {
            const user: JwtUser = {
                roles: payload.auth.split(','),
                strategy: 'default',
                username: payload.email
            };
            done(null, user);
        });

        Server.registerAuthenticator(new PassportAuthenticator(strategy, {
            deserializeUser: (user: string) => JSON.parse(user),
            serializeUser: (user: JwtUser) => {
                return JSON.stringify(user);
            }
        }));
    }

 

}

