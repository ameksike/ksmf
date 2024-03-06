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

class AppCLI extends App {

    /**
     * @description start server 
     * @param {import('../types').TAppConfig} [options] 
     */
    async run(options = null) {
        try {
            this.init(options);
            let target = process.argv[3];
            if (!target) {
                return null;
            }
            let optlst = target?.split(':');
            let module = optlst[0];
            let action = optlst[1] || 'run';
            let mod = this.helper?.get(module);
            mod = mod || this.initModule(module, this.mod);
            if (!mod) {
                return null;
            }
            if (mod[action] instanceof Function) {
                return mod[action](...process.argv.slice(4), this);
            }
        }
        catch (error) {
            this.logger?.error({
                src: 'Ksmf:App:CLI:run',
                error: { message: error.message, code: error.code }
            })
        }
    }
}

module.exports = AppCLI;