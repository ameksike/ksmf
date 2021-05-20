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
        res.json({ "message": "REST API mod <" + this.opt.name + "> selectAll." });
    }

    select(req, res, next) {
        res.json({ "message": "REST API mod <" + this.opt.name + ">  select.", 'id': req.params.id, 'pid': req.params.pid });
    }

    delete(req, res, next) {
        res.json({ "message": "REST API mod <" + this.opt.name + ">  delete.", 'id': req.params.id, 'pid': req.params.pid });
    }

    clean(req, res, next) {
        res.json({ "message": "REST API mod <" + this.opt.name + ">  clean.", 'id': req.params.id, 'pid': req.params.pid });
    }

    update(req, res, next) {
        const elm = {
            'name': req.body['name']
        }
        res.json({ "message": "REST API mod <" + this.opt.name + ">  update.", 'id': req.params.id, 'obj': elm });
    }

    insert(req, res, next) {
        const elm = {
            'name': req.body['name']
        }
        res.json({ "message": "REST API mod <" + this.opt.name + ">  insert.", 'obj': elm });
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
        return middleware;
    }
}
module.exports = Controller;