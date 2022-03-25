/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class Logger {
    /**
     * @description initialize logger
     * @param {OBJECT} opt 
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
     * @param {OBJECT} opt 
     * @returns {OBJECT} self
     */
    configure(opt = null) {
        this.cfg = Object.assign(this.cfg, opt);
        return this;
    }

    /**
     * @description verify if there is a valid log handler
     * @returns {BOOLEAN}
     */
    isValid() {
        return (this.cfg && this.cfg.action instanceof Function);
    }

    /**
     * @description check if logs are allowed
     * @returns {BOOLEAN}
     */
    isEnabled() {
        return this.cfg.level >= 1;
    }

    /**
     * @description set the correct log format
     * @param {OBJECT|STRING} data 
     * @returns {STRING}
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
     * @param {STRING} value 
     * @returns 
     */
    prefix(value) {
        this.cfg.prefix = value;
        return this;
    }

    /**
     * @description set type of logs [info|error|warn|debug]
     * @param {STRING} value 
     * @returns 
     */
    type(value) {
        this.cfg.type = value;
        return this;
    }

    /**
     * @description perform logs
     * @returns {OBJECT} self
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
     * @returns {OBJECT} self
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
     * @returns {OBJECT} self
     */
    warn() {
        this.type(this.cfg.label.warn).log(...arguments);
        return this;
    }

    /**
     * @description alias for perform debug logs
     * @returns {OBJECT} self
     */
    debug() {
        this.type(this.cfg.label.debug).log(...arguments);
        return this;
    }
}

module.exports = Logger;
