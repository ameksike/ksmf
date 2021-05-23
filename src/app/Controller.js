/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class Controller {

    constructor(payload) {
        this.opt = payload && payload.opt ? payload.opt : {};
        this.module = payload && payload.module ? payload.module : {};
        this.middleware = this.initRestMiddleware(this.middleware);
    }

    init() { }

    list(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> LIST.` });
    }

    select(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> SELECT, ID:${req.params.id}.` });
    }

    delete(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> DELETE, ID:${req.params.id}.` });
    }

    clean(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> CLEAN.` });
    }

    update(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> UPDATE, ID:${req.params.id}.` });
    }

    insert(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> INSERT.` });
    }

    options(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> OPTIONS.` });
    }

    option(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> OPTION, ID:${req.params.id}.` });
    }

    initRestMiddleware(middleware) {
        middleware = middleware || {};
        middleware.global = middleware.global instanceof Array ? middleware.global : [];
        middleware.select = middleware.select instanceof Array ? middleware.select : [];
        middleware.insert = middleware.insert instanceof Array ? middleware.insert : [];
        middleware.update = middleware.update instanceof Array ? middleware.update : [];
        middleware.delete = middleware.delete instanceof Array ? middleware.delete : [];
        middleware.clean = middleware.clean instanceof Array ? middleware.clean : [];
        middleware.list = middleware.list instanceof Array ? middleware.list : [];
        middleware.options = middleware.list instanceof Array ? middleware.options : [];
        middleware.option = middleware.list instanceof Array ? middleware.option : [];
        return middleware;
    }
}
module.exports = Controller;