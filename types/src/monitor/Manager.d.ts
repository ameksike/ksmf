export = Manager;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2023
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
declare class Manager {
    constructor(cfg: any);
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    startUsage: NodeJS.CpuUsage;
    configure(cfg: any): void;
    /**
     * @description KsMf Wrapper
     * @param {Object} info
     */
    onStart(info?: any): void;
    /**
     * @description error handler
     * @param {Object} error
     */
    onError(error: any): void;
    /**
     * @description get list of available routes
     * @param {Object} web
     * @returns {Array} list
     */
    getRoutes(web: any): any[];
    /**
     * @description get platform information
     * @returns {Object} info
     */
    info(): any;
}
