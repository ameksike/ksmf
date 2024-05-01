export = Config;
declare class Config {
    /**
     * @description load file config
     * @param {String} target
     * @param {Object} [option]
     * @param {String} [option.dir]
     * @param {String} [option.id]
     * @returns {Object}
     */
    load(target: string, option?: {
        dir?: string;
        id?: string;
    }): any;
    /**
     * @description import data from file
     * @param {String} target
     * @param {Object} [option]
     * @param {String} [option.dir]
     * @param {String} [option.id]
     * @returns {Object}
     */
    import(target: string, option?: {
        dir?: string;
        id?: string;
    }): any;
}
