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
}
module.exports = Controller;