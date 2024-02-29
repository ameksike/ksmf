/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
class Controller {
    /**
     * @description initialize controller
     * @param {Object} [payload] 
     */
    constructor(payload) {
        this.opt = payload?.opt || {};
        this.module = payload?.module || {};
        this.middleware = this.initMiddlewareList(this.middleware);
    }

    /**
     * @description method called after constructor
     */
    init() { /* TODO document why this method 'init' is empty */ }

    /**
     * @description REST controller list method    
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} [next] 
     */
    list(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> LIST.` });
    }

    /**
     * @description REST controller select method    
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next 
     */
    select(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> SELECT, ID:${req.params.id}.` });
    }

    /**
     * @description REST controller delete method    
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} [next] 
     */
    delete(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> DELETE, ID:${req.params.id}.` });
    }

    /**
     * @description REST controller clean method    
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} [next] 
     */
    clean(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> CLEAN.` });
    }

    /**
     * @description REST controller update method    
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} [next] 
     */
    update(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> UPDATE, ID:${req.params.id}.` });
    }

    /**
     * @description REST controller insert method    
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} [next] 
     */
    insert(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> INSERT.` });
    }

    /**
     * @description REST controller clone method
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} [next] 
     */
    clone(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> LIST.` });
    }

    /**
     * @description REST controller options method    
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} [next] 
     */
    options(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> OPTIONS.` });
    }

    /**
     * @description REST controller option method    
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} [next] 
     */
    option(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> OPTION, ID:${req.params.id}.` });
    }

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
    initMiddlewareList(middleware) {
        middleware = middleware || {};
        middleware.global = middleware.global instanceof Array ? middleware.global : [];
        middleware.select = middleware.select instanceof Array ? middleware.select : [];
        middleware.insert = middleware.insert instanceof Array ? middleware.insert : [];
        middleware.update = middleware.update instanceof Array ? middleware.update : [];
        middleware.delete = middleware.delete instanceof Array ? middleware.delete : [];
        middleware.clean = middleware.clean instanceof Array ? middleware.clean : [];
        middleware.list = middleware.list instanceof Array ? middleware.list : [];
        middleware.options = middleware.options instanceof Array ? middleware.options : [];
        middleware.option = middleware.option instanceof Array ? middleware.option : [];
        return middleware;
    }
}
module.exports = Controller;