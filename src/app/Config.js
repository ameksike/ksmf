/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 */
const path = require('path');
class Config {

    /**
     * @description load file config
     * @param {String} target 
     * @param {Object} [option]
     * @param {String} [option.dir]
     * @param {String} [option.id] 
     * @returns {Object}
     */
    load(target, option = null) {
        let { dir = null, id = null } = option || {};
        try {
            let file = dir ? path.join(dir, target) : target;
            let tmp = this.import(file);
            tmp = tmp[id] || tmp["default"] || tmp || {};
            if (tmp?.import) {
                for (let i in tmp.import) {
                    if (tmp.import[i]) {
                        if (!isNaN(parseInt(i))) {
                            Object.assign(tmp, this.load(tmp.import[i], { dir, id }));
                        } else {
                            tmp[i] = this.load(tmp.import[i], { dir, id });
                        }
                    }
                }
            }
            return tmp;
        } catch (error) {
            console.log(JSON.stringify({
                flow: String(Date.now()) + "00",
                level: 1,
                src: "KsMf:Config:load",
                error: error?.message,
                data: { target, dir, id }
            }));
            return {};
        }
    }

    /**
     * @description import data from file
     * @param {String} target 
     * @param {Object} [option]
     * @param {String} [option.dir]
     * @param {String} [option.id] 
     * @returns {Object}
     */
    import(target, option = null) {
        try {
            return require(target);
        }
        catch (error) {
            return {};
        }
    }
}

module.exports = Config;