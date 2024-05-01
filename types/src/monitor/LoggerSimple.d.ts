export = LoggerSimple;
declare class LoggerSimple {
    constructor(config: any);
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @description Set the initial configuration for this lib
     * @param {Object} [config]
     * @param {Object} [config.drv]
     * @param {Object} [config.level]
     * @param {String} [config.sep]
     * @param {String} [config.env]
     * @param {String} [config.type]
     * @param {String} [config.envKey]
     * @param {String} [config.envKeyLevel]
     * @param {Object} [config.envs]
     */
    configure(config?: {
        drv?: any;
        level?: any;
        sep?: string;
        env?: string;
        type?: string;
        envKey?: string;
        envKeyLevel?: string;
        envs?: any;
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
     * @param {Object|null} [level]
     * @param {Number|null} [env]
     * @returns {Boolean}
     */
    isAllow(level?: any | null, env?: number | null): boolean;
    /**
     * @description convert object to string safely
     * @param {Object} value
     * @returns {string | Buffer} result
     */
    toStr(value: any): string | Buffer;
    /**
     * @description Write data to standard I/O
     * @param {Object} level
     * @param  {...any} args
     * @returns {Boolean}
     **/
    print(level: any, ...args: any[]): boolean;
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
