export = Module;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
declare class Module {
    /**
     * @description initialize module
     * @param {Object} payload
     * @param {Object} [payload.app]
     * @param {Object} [payload.web]
     * @param {Object} [payload.opt]
     */
    constructor(payload: {
        app?: any;
        web?: any;
        opt?: any;
    });
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @description initialize module
     * @param {Object} payload
     * @param {Object} [payload.app]
     * @param {Object} [payload.web]
     * @param {Object} [payload.drv]
     * @param {Object} [payload.opt]
     * @param {Object} [payload.rest]
     * @param {Object} [payload.routes]
     * @param {Object} [payload.prefix]
     * @param {Object} [payload.middleware]
     * @returns {Module} self
     */
    configure(payload: {
        app?: any;
        web?: any;
        drv?: any;
        opt?: any;
        rest?: any;
        routes?: any;
        prefix?: any;
        middleware?: any;
    }): Module;
    app: any;
    web: any;
    drv: any;
    opt: any;
    name: any;
    prefix: any;
    rest: any;
    routes: any;
    middleware: any;
    /**
     * @description implement template method pattern
     */
    init(): void;
    /**
     * @description allow customized application initialization by module
     */
    initApp(): void;
    /**
     * @description allow customized config initialization by module
     */
    initConfig(): void;
    /**
     * @description allow customized routes initialization by module
     */
    initRoutes(): void;
    /**
     * @description allow customized web routes initialization by module
     * @param {Object} opt
     * @param {String} [opt.route]
     * @param {String} [opt.action]
     * @param {String} [opt.name]
     * @param {String} [opt.controller]
     * @param {String} [opt.method]
     * @param {String} [opt.path]
     */
    initRoutesWeb(opt: {
        route?: string;
        action?: string;
        name?: string;
        controller?: string;
        method?: string;
        path?: string;
    }): void;
    /**
     * @description allow customized REST routes initialization by module
     * @param {Object} opt
     * @param {String} [opt.route]
     * @param {String} [opt.name]
     * @param {String} [opt.controller]
     * @param {String} [opt.path]
     */
    initRoutesREST(opt: {
        route?: string;
        name?: string;
        controller?: string;
        path?: string;
    }): any;
    /**
     * @description initialize module middleware list
     * @param {Object} middleware
     * @returns {Object} middleware
     */
    initMiddlewareList(middleware: any): any;
    /**
     * @description get IoC locator options
     * @param {Object} opt
     * @param {String} [opt.route]
     * @param {String} [opt.name]
     * @param {String} [opt.controller]
     * @param {String} [opt.path]
     * @param {String} [opt.strict]
     * @param {Object} [opt.params]
     * @param {Object} [opt.options]
     * @param {Object} [opt.dependency]
     * @returns {Object} locator
     */
    getLocator(opt: {
        route?: string;
        name?: string;
        controller?: string;
        path?: string;
        strict?: string;
        params?: any;
        options?: any;
        dependency?: any;
    }): any;
    /**
     * @description get middleware list by controller
     * @param {Object} controller
     * @param {Object} opt
     * @param {String} action
     * @returns {Array} middlewares
     */
    getMiddlewareList(controller: any, opt: any, action?: string): any[];
}
