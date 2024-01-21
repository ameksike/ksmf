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
    startUsage: NodeJS.CpuUsage;
    configure(cfg: any): void;
    logger: any;
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
