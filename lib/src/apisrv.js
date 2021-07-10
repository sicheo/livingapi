"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiServer = void 0;
const tslib_1 = require("tslib");
// apisrv.ts
/**
 * Define ApiServer class
 * @packageDocumentation
 */
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_1 = tslib_1.__importDefault(require("express"));
const https_1 = tslib_1.__importDefault(require("https"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const passport_jwt_1 = require("passport-jwt");
//import * as jwt from 'jsonwebtoken';
const path = tslib_1.__importStar(require("path"));
const typescript_rest_1 = require("typescript-rest");
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const log4js_1 = tslib_1.__importDefault(require("log4js"));
class ApiServer {
    constructor(module, confile = "apisrv.json") {
        this.PORT = Number(process.env.PORT) || 3132;
        this.HOST = process.env.HOST || "0.0.0.0";
        this.HTTPS = process.env.HTTPS || "NO";
        this.LOGLEVEL = process.env.LOGLEVEL || "error";
        this.LOGFILE = process.env.LOGFILE || "apisrv.log";
        this.LOGTYPE = process.env.LOGTYPE || "file";
        this.server = null;
        this._logger = undefined;
        this.APIUSER = process.env.APIUSER || "admin";
        this.APIPWD = process.env.APIPWD || "password";
        this.JWT_SECRET = process.env.JWTOKEN || 'Bty3ndkOla2@ppSo3m';
        this.KEY_ID = process.env.KEY_ID || 'myprivatekey';
        const appender = "apisrv";
        let opts = {
            HOST: "0.0.0.0",
            PORT: "3132",
            HTTPS: "NO",
            LOGTYPE: "file",
            USER: "admin",
            PASSWD: "password",
            JWT_SECRET: "BGyeo�29358nnDuIS193845hn@!",
            LOGFILE: "apisrv.log",
            KEY_ID: "myprivatekey"
        };
        // Read configuration file
        const confpath = path.join(__dirname, "/conf/", confile);
        const rawdata = fs_1.default.readFileSync(confpath, "utf8");
        opts = JSON.parse(rawdata);
        console.log(opts);
        // Assign configuration file values
        this.PORT = Number(opts.PORT);
        this.HOST = opts.HOST;
        this.HTTPS = opts.HTTPS;
        this.LOGTYPE = opts.LOGTYPE;
        this.LOGFILE = opts.LOGFILE;
        this.APIUSER = opts.USER;
        this.APIPWD = opts.PASSWD;
        // Build logger
        const logFile = __dirname + "/logs/" + this.LOGFILE;
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
        };
        log4js_1.default.configure(logopts);
        this._logger = log4js_1.default.getLogger(appender);
        this.app = express_1.default();
        this.router = express_1.default.Router();
        //Server.useIoC();
        // Assign to locals
        this.app.locals.GAGENTUSER = this.APIUSER;
        this.app.locals.GAGENTPWD = this.APIPWD;
        this.app.locals.JWT_SECRET = this.JWT_SECRET;
        this.app.locals.PORT = this.PORT;
        this.app.locals.HOST = this.HOST;
        this.app.locals.HTTPS = this.HTTPS;
        this.app.locals.LOGGER = this._logger;
        // Build service
        this.getModule(module)
            .then((mods) => {
            for (let i = 0; i < mods.length; i++) {
                const values = Object.values(mods[i]);
                for (let j = 0; j < values.length; j++) {
                    typescript_rest_1.Server.buildServices(this.app, values[j]);
                }
            }
        })
            .catch((error) => {
            this._logger.error("Apiserver: Unable to load module");
            this._logger.error(error);
            process.exit(1);
        });
        //Server.swagger(this.app, { filePath: './dist/swagger.json' });
        this.config();
    }
    getApp() {
        return this.app;
    }
    getRouter() {
        return this.router;
    }
    // LOAD module
    getModule(module) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const modules = [];
                for (let i = 0; i < module.length; i++) {
                    const modulepath = "./services/" + module[i];
                    Promise.resolve().then(() => tslib_1.__importStar(require(modulepath))).then((a) => {
                        modules.push(a);
                        if (i == module.length - 1)
                            resolve(modules);
                    })
                        .catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    /**
     * Start the server
     * @returns {Promise<any>}
     */
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this._logger.error("****       AGENT SERVER VER. 1.0      ***********");
                this._logger.error("*                                               *");
                this._logger.error("*               field automation                *");
                this._logger.error("*                  server.                      *");
                this._logger.error("*************************************************");
                this._logger.error("                                                 ");
                if (this.HTTPS == 'YES') {
                    this.server = https_1.default.createServer({
                        key: fs_1.default.readFileSync(__dirname + '/conf/key.pem'),
                        cert: fs_1.default.readFileSync(__dirname + '/conf/aiq.pem')
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
        });
    }
    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.server) {
                    this.server.close(() => {
                        return resolve(true);
                    });
                }
                else {
                    return resolve(true);
                }
            });
        });
    }
    /**
     * Configure the express app.
     * uses cors, morgan, nodeinfo, passport-jwt,
     */
    config() {
        // Native Express configuration
        this.app.use(express_1.default.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
        this.app.use(cors_1.default());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(morgan_1.default('combined'));
        this.app.use(express_1.default.static('lib/src/public'));
        // CONFIGURE AUTHENTICATION
        this.configureAuthenticator();
    }
    configureAuthenticator() {
        const jwtConfig = {
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(this.JWT_SECRET, 'base64'),
        };
        const strategy = new passport_jwt_1.Strategy(jwtConfig, (payload, done) => {
            const user = {
                roles: payload.auth.split(','),
                strategy: 'default',
                username: payload.sub
            };
            done(null, user);
        });
        typescript_rest_1.Server.registerAuthenticator(new typescript_rest_1.PassportAuthenticator(strategy, {
            deserializeUser: (user) => JSON.parse(user),
            serializeUser: (user) => {
                return JSON.stringify(user);
            }
        }));
    }
}
exports.ApiServer = ApiServer;
