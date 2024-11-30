export = App;
declare class App {
    /**
     * @description initialize library
     * @param {Object} [option]
     * @param {String} [option.path] project root path
     * @param {Object} [option.config] configuration options
     * @param {Object} [option.srvHelper] driver to manage plugins
     * @param {Object} [option.srvEvent]  driver to manage events
     * @param {Object} [option.srvConfig] driver to manage configurations
     * @param {Object} [option.srvDir] driver to manage directories
     * @param {Array<any>} [option.mod] plugins/modules list
     **/
    constructor(option?: {
        path?: string;
        config?: any;
        srvHelper?: any;
        srvEvent?: any;
        srvConfig?: any;
        srvDir?: any;
        mod?: Array<any>;
    });
    /**
     * @type {import('ksdp').integration.IoC}
     */
    helper: import("ksdp/types/src/integration/IoC");
    /**
     * @type {import('ksdp').behavioral.Emitter}
     */
    srvEvent: import("ksdp/types/src/behavioral/Emitter");
    /**
     * @type {Config|null}
     */
    srvConfig: Config | null;
    /**
     * @type {Dir|null}
     */
    srvDir: Dir | null;
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
     * @description start application
     * @param {import('../types').TAppConfig} [options]
     */
    start(options?: import("../types").TAppConfig): Promise<void>;
    /**
     * @description stop application
     * @param {import('../types').TAppConfig} [options]
     */
    stop(options?: import("../types").TAppConfig): Promise<void>;
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
    }): App;
    /**
     * @description remove listener from event
     * @param {String} event
     * @param {Object} [option]
     * @param {Number} [option.index]
     * @param {String} [option.event]
     * @param {String} [option.scope]
     * @param {Number} [option.count]
     * @param {Array} [option.rows]
     * @param {Array|Object|Function} [subscriber]
     * @return {App} self
     */
    unsubscribe(event: string, option?: {
        index?: number;
        event?: string;
        scope?: string;
        count?: number;
        rows?: any[];
    }, subscriber?: any[] | any | Function): App;
    /**
     * @description safely trigger events
     * @param {String} event
     * @param {Array} params
     * @returns {App} self
     */
    emit(event: string, params?: any[]): App;
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
    initConfig(options?: import("../types").TAppConfig): Promise<this>;
    /**
     * @description initialize event handler
     */
    initEvents(): Promise<this>;
    /**
     * @description load modules
     */
    initModules(): Promise<this>;
    modules: any[];
    /**
     * @description initialize a module
     * @param {import('../types').TOption|String} item
     * @param {Array} modules
     * @returns {Promise<Object>} module
     */
    initModule(item: import("../types").TOption | string, modules: any[]): Promise<any>;
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
}
import Config = require("../common/Config");
import Dir = require("../common/Dir");
