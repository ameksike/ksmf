/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */

class Module {

    constructor(payload) {
        this.app = payload ? payload.app : null;
        this.opt = payload ? payload.opt : {};

        this.name = this.opt.name;
        this.prefix = "/" + this.name;
        this.routes = [];

        
        console.log('load <<<<<<<<< ', this.name);
    }

    init() {
        this.initConfig();
        this.initRoutes();
    }

    initConfig() {
        this.routes.push({
            route: this.prefix,
            controller: 'DefaultController',
            path: 'controller'
        });
    }

    initRoutes() {
        for (const i in this.routes) {
            this.initRoutesREST(this.routes[i]);
        }
    }

    initRoutesREST(opt) {
        if (!this.app || !this.helper) {
            console.log('Warning: app or helper on Module');
            return null;
        }

        const _prefix = opt.route;
        const _controller = this.helper.get({
            name: opt.controller,
            path: 'controller',
            module: this.name,
            options: {
                opt: this.opt,
                module: this.name
            },
            dependency: {
                'helper': 'helper',
                'dao': 'dao'
            }
        });

        this.app.get(_prefix, (req, res, next) => {
            _controller.list(req, res, next);
        });
        this.app.get(_prefix + "/:id", (req, res, next) => {
            _controller.select(req, res, next);
        });
        this.app.post(_prefix, (req, res, next) => {
            _controller.insert(req, res, next);
        });
        this.app.put(_prefix + "/:id", (req, res, next) => {
            _controller.update(req, res, next);
        });
        this.app.patch(_prefix + "/:id", (req, res, next) => {
            _controller.update(req, res, next);
        });
        this.app.delete(_prefix + "/:id", (req, res, next) => {
            _controller.delete(req, res, next);
        });
    }
}
module.exports = Module;