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
            }
        };
        this.configure(opt);
    }

    configure(opt = null) {
        this.cfg = Object.assign(this.cfg, opt);
        return this;
    }

    prefix(value) {
        this.cfg.prefix = value;
        return this;
    }

    log() {
        if (this.cfg && this.cfg.level >= 1) {
            console.log.apply(this, [`[${this.cfg.prefix}] [${this.cfg.label.info}]`, ...arguments]);
        }
        return this;
    }

    info() {
        if (this.cfg && this.cfg.level >= 1) {
            console.log.apply(this, [`[${this.cfg.prefix}] [${this.cfg.label.info}]`, ...arguments]);
        }
        return this;
    }

    error() {
        if (this.cfg && this.cfg.level >= 1) {
            console.log.apply(this, [`[${this.cfg.prefix}] [${this.cfg.label.error}]`, ...arguments]);
        }
        return this;
    }

    warn() {
        if (this.cfg && this.cfg.level >= 1) {
            console.log.apply(this, [`[${this.cfg.prefix}] [${this.cfg.label.warn}]`, ...arguments]);
        }
        return this;
    }

    debug() {
        if (this.cfg && this.cfg.level >= 1) {
            console.log.apply(this, [`[${this.cfg.prefix}] [${this.cfg.label.debug}]`, ...arguments]);
        }
        return this;
    }
}

module.exports = Logger;
