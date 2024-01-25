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
     * @type {Object|null}
     */
    dao: any | null;
    /**
     * @type {Object|null}
     */
    web: any | null;
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
     * @description initialize serve (Implement template method pattern)
     * @returns {AppWEB} self
     */
    init(): AppWEB;
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
     * @returns {Object}
     */
    loadConfig(target: string, dir: any, id: any): any;
    /**
     * @description preload configuration file, variables, environments, etc
     */
    initConfig(): this;
    drv: any;
    /**
     * @description initialize event handler
     */
    initEvents(): this;
    /**
     * @description set error handler middleware
     */
    initErrorHandler(): void;
    /**
     * @description initialize middleware applications
     */
    initApp(): this;
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
     * @description initialize a module
     * @param {Object|String} item
     * @param {String} [item.name]
     * @param {String} [item.type]
     * @param {Object} [item.options]
     * @param {Object} [item.params]
     * @param {Object} [item.dependency]
     * @param {Array} modules
     * @returns {Object} module
     */
    initModule(item: any | string, modules: any[]): any;
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
    }): any;
    /**
     * @description safely trigger events
     * @returns {AppWEB} self
     */
    emit(...args: any[]): AppWEB;
}
