export = LoggerSimple;
declare class LoggerSimple {
    constructor(config: any);
    /**
     * @description Set the initial configuration for this lib
     * @param {Object} [config] [OPTIONAL]
     * @param {Object} config.drv
     * @param {Object} config.level
     * @param {String} config.sep
     * @param {String} config.env
     * @param {String} config.envKey
     * @param {String} config.envKeyLevel
     * @param {Object} config.envs
     */
    configure(config?: {
        drv: any;
        level: any;
        sep: string;
        env: string;
        envKey: string;
        envKeyLevel: string;
        envs: any;
    }): this;
    level: any;
    envKey: any;
    envKeyLevel: any;
    env: any;
    envs: any;
    sep: any;
    drv: any;
    type: any;
    /**
     * @description get logs configurations
     * @returns {Object}
     */
    getInfo(): any;
    /**
     * @description get current log level
     * @returns {Number}
     */
    getLevel(env: any): number;
    /**
     * @description Define if it is allowed to print data based on the log level in a specific environment
     * @param {String} level
     * @param {String} env
     * @returns {Boolean}
     */
    isAllow(level?: string, env?: string): boolean;
    /**
     * @description convert object to string safely
     * @param {Object} value
     * @returns {String} result
     */
    toStr(value: any): string;
    /**
     * @description Write data to standard I/O
     * @param {String} level
     * @param  {...any} args
     * @returns {Boolean}
     **/
    print(level: string, ...args: any[]): boolean;
    /**
     * @description Alias for info function
     * @param  {...any} args
     * @returns {Boolean}
     */
    log(...args: any[]): boolean;
    /**
     * @description Info level log
     * @param  {...any} args
     * @returns {Boolean}
     */
    info(...args: any[]): boolean;
    /**
     * @description Debug level log
     * @param  {...any} args
     * @returns {Boolean}
     */
    debug(...args: any[]): boolean;
    /**
     * @description WARN level log
     * @param  {...any} args
     * @returns {Boolean}
     */
    warn(...args: any[]): boolean;
    /**
     * @description Error level log
     * @param  {...any} args
     * @returns {Boolean}
     */
    error(...args: any[]): boolean;
}
