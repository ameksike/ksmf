export = Manager;
/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        22/04/2020
 * @copyright   Copyright (c) 2020-2030
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
     * @description Set options on Initialize Configuration Event
     * @param {Object} cfg
     * @param {Object} app
     */
    onInitConfig(cfg: any, app: any): Promise<void>;
    app: any;
    /**
     * @description KsMf Wrapper
     * @param {Object} info
     */
    onStart(info?: any): Promise<void>;
    /**
     * @description error handler
     * @param {Object} error
     */
    onError(error: any): Promise<void>;
    /**
     * @description get platform information
     * @returns {Object} info
     */
    info(): any;
}
