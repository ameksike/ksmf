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
     * @param {Array} [option.list] 
     * @param {Number} [option.index=2] 
     * @param {Object} [option.order] 
     * @param {Object} [option.format]
     * @param {String} [option.path]
     * @param {Boolean} [option.directory]  
     * @returns {Object} result
     */
    getParams(option) {
        let out = {};
        let list = option?.list || process.argv;
        let order = option?.order;
        let format = option?.format;
        let index = option?.index || 2;
        if (order) {
            for (let i in order) {
                out[order[i]] = list[i];
                delete list[i];
            }
        }
        for (let i = index; i < list.length; i++) {
            let argument = list[i];
            if (argument) {
                let search = /-{0,2}([\w|\-|\.|\:]*)=*(.*)/.exec(argument);
                search?.length > 2 && (out[search[1]] = search[2] === '' ? true : search[2]);
            }
        }
        if (format) {
            for (let i in format) {
                format[i] instanceof Function && (out[i] = format[i](out[i]) ?? out[i]);
            }
        }
        option?.directory && (out.directory = _path?.resolve(option?.path || process?.cwd() || '../../../../'));
        return out;
    }
}

module.exports = AppCLI;