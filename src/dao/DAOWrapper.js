/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 */

const path = require('path');
class DAOWrapper {

    /**
     * @description Initialize options on construct DATAWrapper
     * @param {OBJECT} opt 
     */
    constructor(opt) {
        this.dao = null;
        this.cfg = {};
        this.exclude = Array.isArray(opt?.exclude) ? opt.exclude : [];
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
        this.app = this.helper.get('app');
        this.utl = this.helper.get('utl');
        if (this.dao) {
            let cfg = this.cfg?.srv?.db || this.cfg?.srv;
            cfg = this.utl?.from(cfg, this.cfg.srv.from) || cfg;
            this.dao.configure(cfg);
            this.dao.connect();
            this.dao.load(path.join(this.cfg.path, 'db/models/'));
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
        if (!this.exclude.includes(mod.name)) {
            this.dao.load(path.join(this.cfg.srv.module.path, mod.name, "model"));
        }
    }

    /**
     * @description create all models associations
     * @param {ARRAY} modules 
     */
    onLoadedModules(modules) {
        this.dao?.associate && this.dao.associate();
    }
}
module.exports = DAOWrapper;