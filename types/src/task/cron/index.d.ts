export = CronModule;
/**
 * @author		Antonio Membrides Espinosa
 * @date		07/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	MIT
 * @version    	1.0
 * @dependency  node-cron
 **/
declare class CronModule {
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @description configure on initialize configurations event
     */
    onInitConfig(cfg: any): void;
    /**
     * @description configure the cron handler
     * @param {Object} options
     * @param {Object} env
     */
    configure(options: any, env: any): void;
    env: any;
    schedule: any;
    task: {};
    /**
     * @description create scheduled task
     * @param {Object} opt
     * @param {String} key
     */
    booking(opt: any, key: string): any;
}
