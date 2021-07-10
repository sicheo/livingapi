export declare class ApiServer {
    PORT: number;
    HOST: string;
    HTTPS: string;
    LOGLEVEL: string;
    LOGFILE: string;
    LOGTYPE: string;
    private readonly app;
    private readonly router;
    private server;
    private _logger;
    private APIUSER;
    private APIPWD;
    private JWT_SECRET;
    private KEY_ID;
    constructor(module: string[], confile?: any);
    getApp(): any;
    getRouter(): any;
    private getModule;
    /**
     * Start the server
     * @returns {Promise<any>}
     */
    start(): Promise<any>;
    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    stop(): Promise<boolean>;
    /**
     * Configure the express app.
     * uses cors, morgan, nodeinfo, passport-jwt,
     */
    private config;
    private configureAuthenticator;
}
//# sourceMappingURL=apisrv.d.ts.map