export = Logger;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
declare class Logger {
    /**
     * @description initialize logger
     * @param {Object} opt
     */
    constructor(opt?: any);
    cfg: {
        level: number;
        prefix: string;
        label: {
            log: string;
            debug: string;
            error: string;
            info: string;
            warn: string;
        };
        action: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
        scope: Console;
    };
    /**
     * @description allow configure options for logger
     * @param {Object} opt
     * @returns {Logger} self
     */
    configure(opt?: any): Logger;
    /**
     * @description verify if there is a valid log handler
     * @returns {Boolean}
     */
    isValid(): boolean;
    /**
     * @description check if logs are allowed
     * @returns {Boolean}
     */
    isEnabled(): boolean;
    /**
     * @description set the correct log format
     * @param {Boolean|String} data
     * @returns {String}
     */
    format(data: boolean | string): string;
    /**
     * @description set log prefix
     * @param {String} value
     * @returns
     */
    prefix(value: string): this;
    /**
     * @description set type of logs [info|error|warn|debug]
     * @param {String} value
     * @returns {Logger} self
     */
    type(value: string): Logger;
    /**
     * @description perform logs
     * @returns {Logger} self
     */
    log(...args: any[]): Logger;
    /**
     * @description alias for perform info logs
     * @returns {Logger} self
     */
    info(...args: any[]): Logger;
    error(...args: any[]): this;
    /**
     * @description alias for perform warn logs
     * @returns {Logger} self
     */
    warn(...args: any[]): Logger;
    /**
     * @description alias for perform debug logs
     * @returns {Logger} self
     */
    debug(...args: any[]): Logger;
}
