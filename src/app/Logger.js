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
        this.cfg = { level: 0 };
        this.configure(opt);
    }

    configure(opt = null) {
        this.cfg = opt || this.cfg;
    }

    log() {
        if (this.cfg && this.cfg.level === 1) {
            console.log.apply(this, arguments);
        }
    }

    info(){
        if (this.cfg && this.cfg.level === 1) {
            console.log.apply(this, arguments);
        }
    }

    error(){
        if (this.cfg && this.cfg.level === 1) {
            console.log.apply(this, arguments);
        }
    }
}

module.exports = Logger;
