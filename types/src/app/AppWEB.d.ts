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
    /**
     * @description Initialize the application (Implement template method pattern)
     * @param {Object} [options]
     * @param {Object} [options.web]
     * @returns {AppWEB} self
     */
    init(options?: {
        web?: any;
    }): AppWEB;
    /**
     * @description start server
     */
    run(): any;
    /**
     * @description alias for run method
     */
    start(): void;
    /**
     * @description stop server
     */
    stop(): void;
    /**
     * @description load file config
     * @param {String} target
     * @param {String} [dir]
     * @param {String} [id]
     * @returns {Object}
     */
    loadConfig(target: string, dir?: string, id?: string): any;
    /**
     * @description preload configuration file, variables, environments, etc
     */
    initConfig(): this;
    /**
     * @description get the web server
     * @param {Object} [options]
     * @param {Object} [options.web]
     * @returns {Object} server
     */
    getServer(options?: {
        web?: any;
    }): any;
    /**
     * @description initialize event handler
     */
    initEvents(): this;
    /**
     * @description initialize middleware applications
     * @param {Object} [options]
     * @param {Object} [options.web]
     */
    initApp(options?: {
        web?: any;
    }): this;
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
    /**
     * @description safely trigger events
     * @returns {AppWEB} self
     */
    emit(...arg: any[]): AppWEB;
}
