/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class Controller {
    /**
     * @description initialize controller
     * @param {OBJECT} payload 
     */
    constructor(payload) {
        this.opt = payload && payload.opt ? payload.opt : {};
        this.module = payload && payload.module ? payload.module : {};
        this.middleware = this.initMiddlewareList(this.middleware);
    }

    /**
     * @description method called after constructor
     */
    init() { }

    /**
     * @description REST controller list method    
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    list(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> LIST.` });
    }

    /**
     * @description REST controller select method    
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    select(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> SELECT, ID:${req.params.id}.` });
    }

    /**
     * @description REST controller delete method    
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    delete(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> DELETE, ID:${req.params.id}.` });
    }

    /**
     * @description REST controller clean method    
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    clean(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> CLEAN.` });
    }

    /**
     * @description REST controller update method    
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    update(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> UPDATE, ID:${req.params.id}.` });
    }

    /**
     * @description REST controller insert method    
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    insert(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> INSERT.` });
    }

    /**
     * @description REST controller options method    
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    options(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> OPTIONS.` });
    }

    /**
     * @description REST controller option method    
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    option(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> OPTION, ID:${req.params.id}.` });
    }

    /**
     * @description initialize middleware list by method for this controller
     * @param {OBJECT} middleware 
     * @param {ARRAY} middleware.global 
     * @param {ARRAY} middleware.select 
     * @param {ARRAY} middleware.insert 
     * @param {ARRAY} middleware.update 
     * @param {ARRAY} middleware.delete
     * @param {ARRAY} middleware.clean
     * @param {ARRAY} middleware.list 
     * @param {ARRAY} middleware.options 
     * @param {ARRAY} middleware.option 
     * @returns {OBJECT}
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