/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class Logger {

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

    configure(opt = null) {
        this.cfg = Object.assign(this.cfg, opt);
        return this;
    }

    isValid() {
        return (this.cfg && this.cfg.action instanceof Function);
    }

    isEnabled() {
        return this.cfg.level >= 1;
    }

    format(data) {
        if (this.cfg.level >= 2) {
            for (const i in data) {
                try {
                    data[i] = JSON.stringify(data[i]);
                }
                catch (error) { }
            }
        }
        return data;
    }

    prefix(value) {
        this.cfg.prefix = value;
        return this;
    }

    type(value) {
        this.cfg.type = value;
        return this;
    }

    log() {
        if (this.isValid() && this.isEnabled()) {
            const params = this.format(arguments);
            this.cfg.type = this.cfg.type || this.cfg.label.info;
            this.cfg.action.apply(this, [`[${this.cfg.prefix}] [${this.cfg.type}]`, ...params]);
        }
        return this;
    }

    info() {
        this.type(this.cfg.label.info).log(...arguments);
        return this;
    }

    error() {
        this.type(this.cfg.label.error).log(...arguments);
        return this;
    }

    warn() {
        this.type(this.cfg.label.warn).log(...arguments);
        return this;
    }

    debug() {
        this.type(this.cfg.label.debug).log(...arguments);
        return this;
    }
}

module.exports = Logger;
