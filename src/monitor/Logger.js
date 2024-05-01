/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        07/03/2020
 * @copyright   Copyright (c) 2020-2030
 * @license     GPL
 * @version     1.0
 **/
class Logger {
    /**
     * @description initialize logger
     * @param {Object} opt 
     */
    constructor(opt = null) {
        this.cfg = {
            level: 0,
            prefix: 'DEFAULT',
            label: {
                log: 'LOG',
                debug: 'DEBUG',
                error: 'ERROR',
                info: 'INFO',
                warn: 'WARN',
            },
            action: console.log,
            scope: console,
        };
        this.configure(opt);
    }
    
    /**
     * @description allow configure options for logger
     * @param {Object} opt 
     * @returns {Logger} self
     */
    configure(opt = null) {
        this.cfg = Object.assign(this.cfg, opt);
        return this;
    }

    /**
     * @description verify if there is a valid log handler
     * @returns {Boolean}
     */
    isValid() {
        return (this.cfg && this.cfg.action instanceof Function);
    }

    /**
     * @description check if logs are allowed
     * @returns {Boolean}
     */
    isEnabled() {
        return this.cfg.level >= 1;
    }

    /**
     * @description set the correct log format
     * @param {Object} data 
     * @returns {Object} log format
     */
    format(data) {
        if (this.cfg.level >= 2) {
            for (const i in data) {
                try {
                    if (data[i] instanceof Error) {
                        const stack = typeof (data[i].stack) === 'string' ? data[i].stack.split('\n') : data[i].stack;
                        data[i] = JSON.stringify({ message: data[i].message, stack });
                    } else {
                        data[i] = JSON.stringify(data[i]);
                    }
                }
                catch (error) { }
            }
        }
        return data;
    }

    /**
     * @description set log prefix
     * @param {String} value 
     * @returns 
     */
    prefix(value) {
        this.cfg.prefix = value;
        return this;
    }

    /**
     * @description set type of logs [info|error|warn|debug]
     * @param {String} value 
     * @returns {Logger} self
     */
    type(value) {
        this.cfg.type = value;
        return this;
    }

    /**
     * @description perform logs
     * @returns {Logger} self
     */
    log() {
        if (this.isValid() && this.isEnabled()) {
            const params = this.format(arguments);
            this.cfg.type = this.cfg.type || this.cfg.label.info;
            this.cfg.action.apply(this, [`[${this.cfg.prefix}] [${this.cfg.type}]`, ...params]);
        }
        return this;
    }

    /**
     * @description alias for perform info logs
     * @returns {Logger} self
     */
    info() {
        this.type(this.cfg.label.info).log(...arguments);
        return this;
    }

    error() {
        this.type(this.cfg.label.error).log(...arguments);
        return this;
    }

    /**
     * @description alias for perform warn logs
     * @returns {Logger} self
     */
    warn() {
        this.type(this.cfg.label.warn).log(...arguments);
        return this;
    }

    /**
     * @description alias for perform debug logs
     * @returns {Logger} self
     */
    debug() {
        this.type(this.cfg.label.debug).log(...arguments);
        return this;
    }
}

module.exports = Logger;
