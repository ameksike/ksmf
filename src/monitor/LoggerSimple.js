/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		05/03/2023
 * @copyright  	Copyright (c) 2020-2035
 * @license    	GPL
 * @version    	1.0
 */
const KsCryp = require("kscryp");
class LoggerSimple {

    constructor(config) {
        this.configure(config);
    }

    /**
     * @description Set the initial configuration for this lib
     * @param {Object} config [OPTIONAL]
     * @param {Object} config.drv
     * @param {Object} config.level
     * @param {String} config.sep
     * @param {String} config.env
     * @param {String} config.envKey
     * @param {String} config.envKeyLevel
     * @param {Object} config.envs
     */
    configure(config) {
        this.level = config?.level || {
            none: -1,
            all: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4
        };
        this.envKey = config?.envKey || "NODE_ENV";
        this.envKeyLevel = config?.envKeyLevel || "LOG_LEVEL";
        this.env = config?.env || process.env[this.envKey] || "local";
        this.envs = { local: this.level.debug, ...config?.envs };
        this.envs[this.env] = this.envs[this.env] || this.level.debug;
        this.sep = config?.sep || ",";
        this.drv = config?.drv || console;
        this.type = config?.type || "str";
        return this;
    }

    /**
     * @description get logs configurations 
     * @returns {Object}
     */
    getInfo() {
        return {
            levels: this.envs,
            env: this.env,
            current: this.getLevel()
        }
    }

    /**
     * @description get current log level
     * @returns {Number}
     */
    getLevel(env) {
        return process.env[this.envKeyLevel] || this.envs[env ?? this.env] || this.level.error;
    }

    /**
     * @description Define if it is allowed to print data based on the log level in a specific environment
     * @param {String} level
     * @param {String} env
     * @returns
     */
    isAllow(level = null, env = null) {
        level = level || this.level.info
        return this.getLevel(env) >= level;
    }

    /**
     * @description convert object to string safely
     * @param {Object} value 
     * @returns {String} result
     */
    toStr(value) {
        try {
            return KsCryp.encode(value, "json");
        } catch (error) {
            return error?.message;
        }
    }

    /**
     * @description Write data to standard I/O
     * @param {String} level
     * @param  {...any} args
     * @returns {Boolean}
     */
    print(level, ...args) {
        if (this.isAllow(level)) {
            if (this.type === 'str') {
                // eslint-disable-next-line no-console
                this.drv.log(...args.map((item) => this.toStr(item) + this.sep));
            } else {
                // eslint-disable-next-line no-console
                this.drv.log(...args);
            }
            return true;
        }
        return false;
    }

    /**
     * @description Alias for info function
     * @param  {...any} args
     * @returns {Boolean}
     */
    log() {
        return this.print(this.level.all, ...arguments);
    }

    /**
     * @description Info level log
     * @param  {...any} args
     * @returns {Boolean}
     */
    info() {
        return this.print(this.level.info, ...arguments);
    }

    /**
     * @description Debug level log
     * @param  {...any} args
     * @returns {Boolean}
     */
    debug() {
        return this.print(this.level.debug, ...arguments);
    }

    /**
     * @description WARN level log
     * @param  {...any} args
     * @returns {Boolean}
     */
    warn() {
        return this.print(this.level.warn, ...arguments);
    }

    /**
     * @description Error level log
     * @param  {...any} args
     * @returns {Boolean}
     */
    error() {
        return this.print(this.level.error, ...arguments);
    }
}
module.exports = LoggerSimple;
