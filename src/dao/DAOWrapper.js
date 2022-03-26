/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class DAOWrapper {

    /**
     * @description Initialize options on construct DATAWrapper
     * @param {OBJECT} opt 
     */
    constructor(opt) {
        this.dao = null;
        this.cfg = {};
        this.exclude = opt && opt.exclude instanceof Array ? opt.exclude : [];
    }

    /**
     * @description Set options on Initialize Configuration Event 
     * @param {OBJECT} cfg 
     */
    onInitConfig(cfg) {
        this.cfg = cfg;
    }

    /**
     * @description load DAO lib and load project models
     */
    onInitModules() {
        this.dao = this.helper.get('dao');
        if (this.dao) {
            this.cfg.app.log = this.cfg.srv.log;
            this.dao.configure(this.cfg.app);
            this.dao.connect();
            this.dao.load(this.cfg.path + 'db/models/');
        }
    }

    /**
     * @description load models for each module 
     * @param {OBJECT} mod 
     * @returns 
     */
    onLoadModule(mod) {
        if (!this.dao) {
            return null;
        }
        if(!this.exclude.includes(mod.name)){
            this.dao.load(this.cfg.srv.module.path + mod.name + "/model/");
        }
    }
}
module.exports = DAOWrapper;