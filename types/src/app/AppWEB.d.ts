export = AppWEB;
declare class AppWEB extends App {
    constructor(option?: any);
    /**
     * @deprecated
     * @type {Object|null}
     */
    web: any | null;
    /**
     * @deprecated
     * @type {Object|null}
     */
    drv: any | null;
    /**
     * @type {Object|null}
     */
    server: any | null;
    /**
     * @type {Object|null}
     */
    option: any | null;
    /**
     * @description alias for start server
     * @param {import('../types').TAppConfig} [options]
     */
    start(options?: import('../types').TAppConfig): void;
    /**
     * @description stop server
     */
    stop(): Promise<void>;
    /**
     * @description get the web server
     * @param {import('../types').TAppConfig} [options]
     * @returns {Promise<import('../server/BaseServer')>} server
     */
    getServer(options?: import('../types').TAppConfig): Promise<import('../server/BaseServer')>;
    /**
     * @description throw application error
     * @param {Object} error
     * @param {Object} req
     * @param {Object} res
     * @param {Object} next
     */
    setError(error: any, req?: any, res?: any, next?: any): any;
    /**
     * @description Initialize the application (Implement template method pattern)
     * @param {import('../types').TAppConfig} [options]
     * @returns {Promise<AppWEB>} self
     */
    init(options?: import('../types').TAppConfig): Promise<AppWEB>;
    /**
     * @description preload configuration file, variables, environments, etc
     * @param {import('../types').TAppConfig} [options]
     */
    initConfig(options?: import('../types').TAppConfig): this;
    /**
     * @description initialize middleware applications
     * @param {import('../types').TAppConfig} [options]
     */
    initApp(options?: import('../types').TAppConfig): Promise<this>;
    /**
     * @description load application routes
     * @returns {AppWEB} self
     */
    initRoutes(): AppWEB;
    /**
     * @description initialize a route
     * @param {Object} route
     * @param {String} [route.id]
     * @param {String} [route.name]
     * @param {String} [route.action]
     * @param {String} [route.controller]
     * @param {String} [route.module]
     * @param {String} [route.method]
     * @param {String} [route.path]
     * @param {String} pathname
     * @returns {Object} route
     */
    initRoute(route: {
        id?: string;
        name?: string;
        action?: string;
        controller?: string;
        module?: string;
        method?: string;
        path?: string;
    }, pathname: string): any;
}
import App = require("./App");
