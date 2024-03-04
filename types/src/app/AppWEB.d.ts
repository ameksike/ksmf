export = AppWEB;
declare class AppWEB {
    /**
     * @description initialize library
     * @param {String} path
     **/
    constructor(path: string);
    /**
     * @type {Object|null}
     */
    helper: any | null;
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
     * @type {Console|null}
     */
    logger: Console | null;
    option: {
        app: {};
        srv: {};
    };
    path: string;
    mod: any[];
    cfg: {};
    event: import("ksdp/types/src/behavioral/Observer");
    config: Config;
    /**
     * @description register a plugin
     * @param {Object|String|Function|Array} plugin
     * @param {Object} [option]
     * @returns {AppWEB} self
     */
    register(plugin: any | string | Function | any[], option?: any): AppWEB;
    /**
     * @description remove a plugin
     * @param {Object|String|Function|Array} plugin
     * @param {Object} option
     * @returns {AppWEB} self
     */
    unregister(plugin?: any | string | Function | any[], option?: any): AppWEB;
    /**
     * @description add listener to event
     * @param {Array|Object|Function} subscriber
     * @param {String} [event]
     * @param {Object} [option]
     * @param {String} [option.event]
     * @param {String} [option.scope]
     * @param {Number} [option.index]
     * @param {Array} [option.rows]
     * @return {AppWEB} self
     */
    subscribe(subscriber: any[] | any | Function, event?: string, option?: {
        event?: string;
        scope?: string;
        index?: number;
        rows?: any[];
    }, scope?: string): AppWEB;
    /**
     * @description remove listener from event
     * @param {String} event
     * @param {Object} [option]
     * @param {Number} [option.index]
     * @param {String} [option.event]
     * @param {String} [option.scope]
     * @param {Number} [option.count]
     * @param {Array} [option.rows]
     * @return {AppWEB} self-reference
     */
    unsubscribe(event: string, option?: {
        index?: number;
        event?: string;
        scope?: string;
        count?: number;
        rows?: any[];
    }, scope?: string): AppWEB;
    /**
     * @description safely trigger events
     * @param {String} event
     * @param {Array} params
     * @param {String} scope
     * @returns {AppWEB} self
     */
    emit(event: string, params?: any[], scope?: string): AppWEB;
    /**
     * @description Initialize the application (Implement template method pattern)
     * @param {import('../types').TAppConfig} [options]
     * @returns {Promise<AppWEB>} self
     */
    init(options?: import('../types').TAppConfig): Promise<AppWEB>;
    /**
     * @description start server
     * @param {import('../types').TAppConfig} [options]
     */
    run(options?: import('../types').TAppConfig): Promise<void>;
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
     * @description preload configuration file, variables, environments, etc
     */
    initConfig(): this;
    /**
     * @description get the web server
     * @param {import('../types').TAppConfig} [options]
     * @returns {Promise<import('../server/BaseServer')>} server
     */
    getServer(options?: import('../types').TAppConfig): Promise<import('../server/BaseServer')>;
    /**
     * @description initialize event handler
     */
    initEvents(): this;
    /**
     * @description initialize middleware applications
     * @param {import('../types').TAppConfig} [options]
     */
    initApp(options?: import('../types').TAppConfig): Promise<this>;
    /**
     * @description throw application error
     * @param {Object} error
     * @param {Object} req
     * @param {Object} res
     * @param {Object} next
     */
    setError(error: any, req?: any, res?: any, next?: any): any;
    /**
     * @description load modules
     */
    initModules(): this;
    modules: any[];
    /**
     * @typedef {Object} TOption
     * @property {String} [item.name]
     * @property {String} [item.type]
     * @property {Object} [item.options]
     * @property {Object} [item.params]
     * @property {Object} [item.dependency]
     *
     * @description initialize a module
     * @param {TOption|String} item
     * @param {Array} modules
     * @returns {Object} module
     */
    initModule(item: string | {
        name?: string;
        type?: string;
        options?: any;
        params?: any;
        dependency?: any;
    }, modules: any[]): any;
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
import Config = require("./Config");
