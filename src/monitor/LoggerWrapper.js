/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2023
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class LoggerWrapper {
    /**
     * @description Set options on Initialize Configuration Event 
     * @param {OBJECT} cfg 
     */
    onInitConfig(cfg) {
        this.manager.configure(cfg.srv?.log);
        const logger = this.manager.build();
        this.helper.set(logger, 'logger');
    }

    onInitApp(web) {
        const logger = this.helper.get('logger');
        logger.trackOutbound();
        web.use(logger.trackInbound());
    }
}
module.exports = LoggerWrapper;