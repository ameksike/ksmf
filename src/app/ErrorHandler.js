/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class ErrorHandler {
    /**
     * @description initialize error handler
     * @param {OBJECT} opt 
     */
    constructor(opt = null) {
        this.cfg = { level: 0 };
        this.configure(opt);
    }

    /**
     * @description allow to configure the error handler
     */
    configure(opt = null) {
        this.cfg = opt || this.cfg;
    }

    /**
     * @description Errors catcher 
     * @param {OBJECT} err 
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    on(err, req = null, res = null, next = null) {
        return res.json({
            error: {
                code: err.code,
                message: err.message,
            }
        });
    }
}

module.exports = ErrorHandler;