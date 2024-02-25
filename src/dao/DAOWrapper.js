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
     * @type {Object|null}
     */
    helper = null;

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @description Initialize options on construct DATAWrapper
     * @param {Object} opt 
     */
    constructor(opt) {
        this.dao = null;
        this.cfg = {};
        this.exclude = Array.isArray(opt?.exclude) ? opt.exclude : [];
        this.service = opt?.service;
    }

    /**
     * @description Set options on Initialize Configuration Event 
     * @param {Object} cfg 
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
     * @param {Object} mod 
     * @returns 
     */
    onLoadModule(mod) {
        if (!this.dao) {
            return null;
        }
        if (!this.exclude.includes(mod.name)) {
            let pat = mod._?.path || path.join(this.cfg.srv.module.path, mod.name);
            let dir = path.join(pat, "model");
            this.dao.load(dir);
        }
    }

    /**
     * @description create all models associations
     * @param {Array} modules 
     */
    onLoadedModules(modules) {
        this.dao?.associate && this.dao.associate();
        this.loadModules();
    }

    /**
     * @description create all models associations
     */
    loadModules() {
        this.dao = this.dao || this.helper?.get('dao');
        this.app = this.app || this.helper.get('app');
        if (!this.app || !this.dao?.models || this.service !== "rest") {
            return;
        }
        for (let name in this.dao.models) {
            let mod = {
                "id": "ksmf.rest." + name,
                "name": "ksmf",
                "type": "lib",
                "namespace": "dao.DataModule",
                "options": {
                    "db": {
                        "modelName": name
                    }
                }
            };
            this.app.initModule(mod);
        }
    }

    onStop() {
        this.dao = this.dao || this.helper?.get('dao');
        if (this.dao?.disconnect instanceof Function) {
            this.dao.disconnect();
        }
    }
}
module.exports = DAOWrapper;