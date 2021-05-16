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