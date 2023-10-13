/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		21/05/2022
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/

const Module = require('../app/Module');

class DataModule extends Module {

    configure(payload) {
        super.configure(payload);
        this.db = payload?.db || this.db || {};
    }

    init() {
        if (!this.db?.modelName) {
            return null;
        }
        const controller = {
            route: this.prefix + "/" + this.db.modelName,
            strict: true,
            id: "ksmf.dao.Controller." + this.db.modelName,
            name: "ksmf",
            type: "lib",
            namespace: "dao.DataController",
            dependency: {
                helper: "helper",
                dao: "dao",
                srv: {
                    name: "ksmf",
                    type: "lib",
                    id: "ksmf.dao.Service." + this.db.modelName,
                    namespace: "dao.DataService",
                    dependency: {
                        helper: "helper",
                        dao: "dao",
                    },
                    options: this.db
                }
            }
        };
        super.initRoutesREST(controller);
    }
}

module.exports = DataModule;