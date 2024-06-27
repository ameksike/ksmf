export = App;
declare class App {
    /**
     * @description initialize library
     * @param {Object} [option]
     * @param {String} [option.path] project root path
     * @param {Object} [option.cfg] configuration options
     * @param {Object} [option.helper] driver to manage plugins
     * @param {Object} [option.event]  driver to manage events
     * @param {Object} [option.config] driver to manage configurations
     * @param {Object} [option.dir] driver to manage directories
     * @param {Array<any>} [option.mod] plugins/modules list
     **/
    constructor(option?: {
        path?: string;
        cfg?: any;
        helper?: any;
        event?: any;
        config?: any;
        dir?: any;
        mod?: Array<any>;
    });
    /**
     * @type {import('ksdp').integration.IoC}
     */
    helper: import("ksdp/types/src/integration/IoC");
    /**
     * @type {import('ksdp').behavioral.Observer}
     */
    event: import("ksdp/types/src/behavioral/Observer");
    /**
     * @type {Config|null}
     */
    config: Config | null;
    /**
     * @type {Dir|null}
     */
    dir: Dir | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @type {Array}
     */
    mod: any[];
    /**
     * @type {Object}
     */
    cfg: any;
    path: string;
    /**
     * @description register a plugin
     * @param {Object|String|Function|Array} plugin
     * @param {Object} [option]
     * @returns {App} self
     */
    register(plugin: any | string | Function | any[], option?: any): App;
    /**
     * @description remove a plugin
     * @param {Object|String|Function|Array} plugin
     * @param {Object} option
     * @returns {App} self
     */
    unregister(plugin?: any | string | Function | any[], option?: any): App;
    /**
     * @description add listener to event
     * @param {Array|Object|Function} subscriber
     * @param {String} [event]
     * @param {Object} [option]
     * @param {String} [option.event]
     * @param {String} [option.scope]
     * @param {Number} [option.index]
     * @param {Array} [option.rows]
     * @return {App} self
     */
    subscribe(subscriber: any[] | any | Function, event?: string, option?: {
        event?: string;
        scope?: string;
        index?: number;
        rows?: any[];
    }, scope?: string): App;
    /**
     * @description remove listener from event
     * @param {String} event
     * @param {Object} [option]
     * @param {Number} [option.index]
     * @param {String} [option.event]
     * @param {String} [option.scope]
     * @param {Number} [option.count]
     * @param {Array} [option.rows]
     * @return {App} self
     */
    unsubscribe(event: string, option?: {
        index?: number;
        event?: string;
        scope?: string;
        count?: number;
        rows?: any[];
    }, scope?: string): App;
    /**
     * @description safely trigger events
     * @param {String} event
     * @param {Array} params
     * @param {String} scope
     * @returns {App} self
     */
    emit(event: string, params?: any[], scope?: string): App;
    /**
     * @description initialize the application
     * @param {import('../types').TAppConfig} [options]
     * @returns {Promise<App>} self
     */
    init(options?: import("../types").TAppConfig): Promise<App>;
    /**
     * @description preload configuration file, variables, environments, etc
     * @param {import('../types').TAppConfig} [options]
     */
    initLoad(options?: import("../types").TAppConfig): void;
    /**
     * @description initialize configurations
     * @param {import('../types').TAppConfig} [options]
     */
    initConfig(options?: import("../types").TAppConfig): this;
    /**
     * @description initialize event handler
     */
    initEvents(): this;
    /**
     * @description load modules
     */
    initModules(): Promise<this>;
    modules: any[];
    /**
     * @description initialize a module
     * @param {import('../types').TOption|String} item
     * @param {Array} modules
     * @returns {Object} module
     */
    initModule(item: import("../types").TOption | string, modules: any[]): any;
    /**
     * @description initialize the module options
     * @returns {Object}
     */
    initModuleOpts(): any;
    /**
     * @description initialize the module config
     * @param {Object} module
     * @param {Object} option
     * @returns {Object} module
     */
    initModuleSetup(module: any, option: any): any;
    /**
     * @description start server
     * @param {import('../types').TAppConfig} [options]
     */
    run(options?: import("../types").TAppConfig): Promise<void>;
}
import Config = require("./Config");
import Dir = require("./Dir");
