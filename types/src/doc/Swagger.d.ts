export = Swagger;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/02/2022
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @require     swagger-ui-express swagger-jsdoc
 * @description it's recommended to use KsDocs instead. Swagger wrapper for creating API docs: https://swagger.io/specification/
 * @deprecated
 **/
declare class Swagger {
    /**
     * @description Initialize options on construct Swagger
     * @param {Object} opt
     */
    constructor(opt: any);
    /**
     * @type {Object|null}
     */
    helper: any | null;
    cfg: {};
    exclude: any;
    definition: {};
    /**
     * @description Set options on Initialize Configuration Event
     * @param {Object} cfg
     */
    onInitConfig(cfg: any): void;
    /**
     * @description load models for each module
     * @param {Object} mod
     * @returns
     */
    onLoadModule(mod: any): void;
    /**
     * @description create all models associations
     * @param {Object} app
     */
    onInitCompleted(app: any): any;
    /**
     * @description Simple object check.
     * @param item
     * @returns {Boolean}
     */
    isObject(item: any): boolean;
    /**
     * @description Deep merge two objects.
     * @param target
     */
    mergeDeep(target: any, ...sources: any[]): any;
}
