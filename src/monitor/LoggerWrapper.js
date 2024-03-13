/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2023
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
class LoggerWrapper {
    /**
     * @type {Object|null}
     */
    helper = null;

    /**
     * @type {Object|null}
     */
    manager = null;

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @description Set options on Initialize Configuration Event 
     * @param {Object} cfg 
     * @param {Object} app 
     */
    onInitConfig(cfg, app) {
        this.manager?.configure(cfg.srv?.log);
        const logger = this.manager?.build();
        // logger && this.helper?.set(logger, 'logger');
        this.app = app || this.helper?.get('app');
        logger && this.app?.register(logger, 'logger');
        this.app?.subscribe(this, 'onInitApp');
    }

    /**
     * @description Set options on Initialize App Event 
     * @param {Object} server 
     */
    onInitApp(server) {
        const logger = this.helper?.get('logger');
        (logger?.trackOutbound instanceof Function) && logger.trackOutbound();
        server.web.use instanceof Function && (logger?.trackInbound instanceof Function) && server.web.use(logger.trackInbound());
    }
}
module.exports = LoggerWrapper;