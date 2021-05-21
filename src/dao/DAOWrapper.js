/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class DAOWrapper {

    constructor(opt) {
        this.dao = null;
        this.cfg = {};
    }

    onInitConfig(cfg) {
        this.cfg = cfg;
    }

    onInitModules() {
        this.dao = this.helper.get('dao');
        if (this.dao) {
            this.dao.configure(this.cfg.app);
            this.dao.connect();
            this.dao.load(this.cfg.path + 'db/models/');

            this.dao.onLog = () => {
                this.setLog('info', ...arguments);
            }

            this.dao.onError = (error) => {
                const message = error.message ? error.message : error;
                this.setLog('error', message);
            }
        }
    }

    setLog(type, data) {
        const handler = this.helper.get('logger');
        if (handler && handler.log) {
            if (handler.configure) {
                handler.configure({
                    level: (this.cfg && this.cfg.srv && this.cfg.srv.log) ? this.cfg.srv.log : 1,
                    prefix: '[KsMf.DAO.Sequelize]',
                    type
                });
            }
            handler.log(...data);
        }
    }

    onLoadModule(mod) {
        if (!this.dao) {
            return null;
        }
        this.dao.load(this.cfg.srv.module.path + mod.name + "/model/");
    }
}
module.exports = DAOWrapper;