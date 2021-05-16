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
        this.web = payload ? payload.web : null;
        this.opt = payload ? payload.opt : {};

        this.name = this.opt.name;
        this.prefix = "/" + this.name;
        this.initSrc();
    }

    init() {
        this.initConfig();
        this.initApp();
        this.initRoutes();
    }

    initSrc() {
        this.middleware = this.middleware || {};
        this.middleware.global = this.middleware.global instanceof Array ? this.middleware.global : [];
        this.middleware.list = this.middleware.list instanceof Array ? this.middleware.list : [];
        this.middleware.select = this.middleware.select instanceof Array ? this.middleware.select : [];
        this.middleware.insert = this.middleware.insert instanceof Array ? this.middleware.insert : [];
        this.middleware.update = this.middleware.update instanceof Array ? this.middleware.update : [];
        this.middleware.delete = this.middleware.delete instanceof Array ? this.middleware.delete : [];
        this.routes = this.routes instanceof Array ? this.routes : [];
    }

    initApp() { }

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
            this.initRoutesWeb(this.routes[i]);
        }
    }

    initRoutesWeb(opt) { }

    initRoutesREST(opt) {
        this.initSrc();
        if (!this.app || !this.helper) {
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
                'helper': 'helper'
            }
        });

        this.app.get.apply(this.app, [_prefix, ...this.middleware.global, ...this.middleware.list, (req, res, next) => {
            _controller.list(req, res, next);
        }]);

        this.app.get.apply(this.app, [_prefix + "/:id", ...this.middleware.global, ...this.middleware.select, (req, res, next) => {
            _controller.select(req, res, next);
        }]);

        this.app.post.apply(this.app, [_prefix, ...this.middleware.global, ...this.middleware.insert, (req, res, next) => {
            _controller.insert(req, res, next);
        }]);

        this.app.put.apply(this.app, [_prefix + "/:id", ...this.middleware.global, ...this.middleware.update, (req, res, next) => {
            _controller.update(req, res, next);
        }]);

        this.app.patch.apply(this.app, [_prefix + "/:id", ...this.middleware.global, ...this.middleware.update, (req, res, next) => {
            _controller.update(req, res, next);
        }]);

        this.app.delete.apply(this.app, [_prefix + "/:id", ...this.middleware.global, ...this.middleware.delete, (req, res, next) => {
            _controller.delete(req, res, next);
        }]);
    }
}
module.exports = Module;