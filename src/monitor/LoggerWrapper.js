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
     * @description Set options on Initialize Configuration Event 
     * @param {Object} cfg 
     */
    onInitConfig(cfg) {
        this.manager?.configure(cfg.srv?.log);
        const logger = this.manager?.build();
        logger && this.helper?.set(logger, 'logger');
    }

    /**
     * @description Set options on Initialize App Event 
     * @param {Object} cfg 
     */
    onInitApp(web) {
        const logger = this.helper?.get('logger');
        (logger?.trackOutbound instanceof Function) && logger.trackOutbound();
        web && (logger?.trackInbound instanceof Function) && web.use(logger.trackInbound());
    }
}
module.exports = LoggerWrapper;