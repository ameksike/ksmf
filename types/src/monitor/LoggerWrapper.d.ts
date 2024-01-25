export = LoggerWrapper;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2023
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
declare class LoggerWrapper {
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Object|null}
     */
    manager: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @description Set options on Initialize Configuration Event
     * @param {Object} cfg
     */
    onInitConfig(cfg: any): void;
    /**
     * @description Set options on Initialize App Event
     * @param {Object} web
     */
    onInitApp(web: any): void;
}
