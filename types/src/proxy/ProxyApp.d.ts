/// <reference types="node" />
export = ProxyApp;
declare class ProxyApp {
    constructor(path: any);
    app: AppWEB;
    /**
     * @description initialize server proxy app
     */
    init(): this;
    /**
     * @description start app server
     */
    start(): void;
    /**
     * @description stop app server
     */
    stop(): void;
    /**
     * @description run app server
     */
    run(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    inf: any;
    /**
     * @description Get request information
     * @param {Object} req
     * @param {Object} res
     * @param {Object} head
     * @returns {Object}
     */
    initInfo(req: any, res: any, head: any): any;
    /**
     * @description Run rules handler and get if is valid request or not
     * @param {Object} req
     * @param {Object} res
     * @returns {Boolean}
     */
    initRules(req: any, res: any): boolean;
    /**
     * @description Run authentication handler and get if is valid request or not
     * @param {Object} req
     * @param {Object} res
     * @returns {Boolean}
     */
    initAuth(req: any, res: any): boolean;
    pipe(req: any, clientSocket: any, srv: any): void;
}
import AppWEB = require("../app/AppWEB");
import http = require("http");
