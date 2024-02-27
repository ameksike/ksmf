/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 */
const express = require('express');
const cookieParser = require('cookie-parser');

const https = require('https');

class ServerExpress {

    /**
     * @type {Object|null}
     */
    web = null;

    /**
     * @type {Object|null}
     */
    drv = null;

    /**
     * @description configure the web server
     * @param {Object} [payload]
     * @param {Object} [payload.web] 
     * @param {Boolean} [payload.cookie] 
     * @returns {ServerExpress} self
     */
    configure(payload) {
        this.web = payload?.web || express();
        this.drv = express;

        //... Allow cookie Parser
        payload?.cookie && server.add(cookieParser());

        //... Allow body Parser
        this.web.use(express.urlencoded({ extended: true }));

        return this;
    }

    /**
     * @description publish static files
     * @param {String} url 
     * @param {String} path 
     */
    publish(url, path) {
        //... Allow static files
        url && path && this.drv && this.web?.use(url, this.drv.static(path));
    }

    /**
     * @description delete routes 
     * @param {String|Array<String>} value 
     * @param {Function} check 
     * @returns {Boolean}
     */
    del(value, check = null) {
        if (!(this.web?._router?.stack?.filter instanceof Function)) {
            return false;
        }
        check = check instanceof Function ? check : ((item, value) => Array.isArray(value) ? !value.includes(item?.route?.path) : item?.route?.path !== value);
        this.web._router.stack = value ? this.web._router.stack.filter(layer => check(layer, value)) : [];
        return true;
    }

    /**
     * @description add routes
     */
    add(...arg) {
        this.web?.use(...arg);
    }

    /**
     * @description alias to use action
     */
    use(...arg) {
        this.web?.use(...arg);
    }

    /**
     * @description HTTP get
     */
    get(...arg) {
        this.web?.get(...arg);
    }

    /**
     * @description HTTP POST
     */
    post(...arg) {
        this.web?.post(...arg);
    }

    /**
     * @description HTTP put
     */
    put(...arg) {
        this.web?.put(...arg);
    }

    /**
     * @description HTTP delete
     */
    delete(...arg) {
        this.web?.delete(...arg);
    }

    /**
     * @description HTTP patch
     */
    patch(...arg) {
        this.web?.patch(...arg);
    }

    /**
     * @description HTTP options
     */
    options(...arg) {
        this.web?.options(...arg);
    }

    /**
     * @description start the server
     * @param {Object} [payload] 
     * @param {Number} [payload.port]
     * @param {String} [payload.key]
     * @param {String} [payload.cert] 
     * @param {Boolean} [payload.secure] 
     * @param {Object} [payload.app] 
     * @param {Function} [payload.callback] 
     */
    start(payload = null) {
        const { key, cert, protocol = 'http', port = 3003, host = '127.0.0.1', app = this.web } = payload || {};
        return new Promise((resolve, reject) => {
            try {
                if (protocol === 'https' && key && cert) {
                    https.createServer({ key, cert }, app).listen(port, () => resolve({ port, host, protocol: 'https' }));
                } else {
                    app.listen(port, () => resolve({ port, host, protocol: 'http' }));
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description stop server 
     */
    stop() {
        if (this.web?.close instanceof Function) {
            this.web.close();
        }
    }
}
module.exports = ServerExpress;