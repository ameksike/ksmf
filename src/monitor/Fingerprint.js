/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
const kscryp = require('kscryp');

class Fingerprint {
    /**
     * @type {Object|null}
     */
    helper = null;
    
    /**
     * @type {*}
     */
    driver;

    /**
     * @type {Console|null}
     */
    logger;

    /**
     * @type {Array<(req: Request, res: Response, next: Function) => void>}
     */
    middleware

    constructor(cfg = null) {
        this.driver = require('express-fingerprint');
        this.logger = null;
        this.middleware = [];
        cfg && this.configure(cfg);
    }

    /**
     * @description configure the Fingerprint lib
     * @param {Object} cfg 
     * @param {Array} [cfg.middleware] 
     * @param {Console} [cfg.logger] 
     * @returns {Fingerprint} self
     */
    configure(cfg) {
        this.logger = cfg?.logger || this.logger;
        this.middleware = cfg?.middleware || this.middleware;
        return this;
    }

    /**
     * @description Set options on Initialize Configuration Event 
     * @param {Object} cfg 
     */
    onInitConfig(cfg) {
        this.logger = this.helper?.get("logger") || this.logger;
        this.configure(cfg);
        this.init();
    }

    /**
     * @description activate the Fingerprint detection 
     * @param {Object} app 
     */
    init(app) {
        app?.use(this.driver({
            parameters: [
                this.driver.useragent,
                this.driver.acceptHeaders,
                this.driver.geoip,
                ...this.middleware,
                (cb, req, res) => {
                    let hostLs = req.headers['host'].split(":")
                    let server = { host: req.headers['host'], ip: hostLs[0], port: hostLs[1] };
                    let client = { ip: req.ip, name: req.hostname, ipOriginal: req.headers['x-forwarded-for'] || req.connection?.remoteAddress }
                    let useragent = kscryp.decode(req.headers['user-agent'], 'json');
                    cb(null, typeof useragent === "object" ? { useragent, server, client } : { server, client });
                }
            ]
        }));
    }
}

module.exports = Fingerprint;