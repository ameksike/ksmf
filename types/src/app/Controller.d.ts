export = Controller;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
declare class Controller {
    /**
     * @description initialize controller
     * @param {Object} [payload]
     */
    constructor(payload?: any);
    opt: any;
    module: any;
    middleware: any;
    /**
     * @description method called after constructor
     */
    init(): void;
    /**
     * @description REST controller list method
     * @param {Object} req
     * @param {Object} res
     * @param {Object} [next]
     */
    list(req: any, res: any, next?: any): void;
    /**
     * @description REST controller select method
     * @param {Object} req
     * @param {Object} res
     * @param {Object} next
     */
    select(req: any, res: any, next: any): void;
    /**
     * @description REST controller delete method
     * @param {Object} req
     * @param {Object} res
     * @param {Object} [next]
     */
    delete(req: any, res: any, next?: any): void;
    /**
     * @description REST controller clean method
     * @param {Object} req
     * @param {Object} res
     * @param {Object} [next]
     */
    clean(req: any, res: any, next?: any): void;
    /**
     * @description REST controller update method
     * @param {Object} req
     * @param {Object} res
     * @param {Object} [next]
     */
    update(req: any, res: any, next?: any): void;
    /**
     * @description REST controller insert method
     * @param {Object} req
     * @param {Object} res
     * @param {Object} [next]
     */
    insert(req: any, res: any, next?: any): void;
    /**
     * @description REST controller options method
     * @param {Object} req
     * @param {Object} res
     * @param {Object} [next]
     */
    options(req: any, res: any, next?: any): void;
    /**
     * @description REST controller option method
     * @param {Object} req
     * @param {Object} res
     * @param {Object} [next]
     */
    option(req: any, res: any, next?: any): void;
    /**
     * @description initialize middleware list by method for this controller
     * @param {Object} [middleware]
     * @param {Array} [middleware.global]
     * @param {Array} [middleware.select]
     * @param {Array} [middleware.insert]
     * @param {Array} [middleware.update]
     * @param {Array} [middleware.delete]
     * @param {Array} [middleware.clean]
     * @param {Array} [middleware.list]
     * @param {Array} [middleware.options]
     * @param {Array} [middleware.option]
     * @returns {Object}
     */
    initMiddlewareList(middleware?: {
        global?: any[];
        select?: any[];
        insert?: any[];
        update?: any[];
        delete?: any[];
        clean?: any[];
        list?: any[];
        options?: any[];
        option?: any[];
    }): any;
}
