/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.3
 * @requires    dotenv
 * @requires    ksdp
 **/
const App = require('./App');
const _path = require('path');

class AppCLI extends App {

    /**
     * @description start server 
     * @param {import('../types').TAppConfig} [options] 
     */
    async run(options = null) {
        try {
            this.init(options);
            let { module, action } = this.getMetaModule(process.argv[3]);
            if (!module) {
                return null;
            }
            if (module[action] instanceof Function) {
                return module[action](this, ...process.argv.slice(4));
            }
        }
        catch (error) {
            this.logger?.error({
                src: 'Ksmf:App:CLI:run',
                error: { message: error.message, code: error.code }
            })
        }
    }

    /**
     * @description search a module by CLI route
     * @param {String|null} route
     * @param {String} [sep=':']
     */
    getMetaModule(route, sep = ':') {
        if (!route) {
            return null;
        }
        let optlst = route?.split(sep);
        let module = optlst[0];
        let action = optlst[1] || 'run';
        let mod = this.helper?.get(module);
        return {
            module: mod || this.initModule(module, this.mod),
            action
        };
    }

    /**
     * @description process CLI arguments 
     * @param {Object} [option] 
     * @returns {Object} result
     */
    getParams(option) {
        let list = option?.list || process.argv;
        let out = {};
        let index = option?.index || 2;
        if (Array.isArray(option?.order)) {
            for (let i in option.order) {
                out[option.order[i]] = list[i];
                index = i;
            }
        }
        for (let i = index; i < list.length; i++) {
            let argument = list[i];
            let search = /-{0,2}([\w|\-|\.|\:]*)=*(.*)/.exec(argument);
            search?.length > 2 && (out[search[1]] = search[2] === '' ? true : search[2]);
        }
        option?.directory && (out.directory = _path?.resolve(option?.path || process?.cwd() || '../../../../'));
        return out;
    }
}

module.exports = AppCLI;