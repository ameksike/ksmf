/// <reference types="node" />
export = AppRTA;
declare class AppRTA {
    constructor(path: any);
    app: AppWEB;
    sockets: {};
    /**
     * @description initialize server proxy app
     */
    init(): this;
    /**
     * @description on load module
     * @param {Object} mod
     * @param {String} [name]
     * @param {String} [path]
     */
    onLoadModule(mod: any, name?: string, path?: string): void;
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
    wss: import("socket.io").Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>;
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    initConnection(): void;
    /**
     * @description initialize channels configurations by client
     * @param {Array} list
     */
    initChannels(wsc: any, list: any[]): void;
    /**
     * @description Run authentication handler and get if is valid request or not
     * @param {Object} req
     * @param {Object} res
     * @returns {Promise<boolean>}
     */
    initAuth(req: any, res: any): Promise<boolean>;
}
import AppWEB = require("./AppWEB");
import http = require("http");
