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
        this.rest = true;
        this.routes = [];
        this.middleware = this.initMiddlewareList(this.middleware);
    }

    init() {
        this.initConfig();
        this.initApp();
        this.initRoutes();
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
            const route = this.routes[i];
            route.method = route.method || 'rest';
            if (this.rest && route.method === 'rest') {
                this.initRoutesREST(route);
            }
            this.initRoutesWeb(route);
        }
    }

    initRoutesWeb(opt) {
        if (!opt || !opt.action || !this.app || !this.helper || typeof (this.app[opt.method]) !== 'function') return;
        // ... load controller 
        const _route = this.app[opt.method];
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
                'app': 'app'
            }
        }); 
        // ... define routes  
        _route.apply(this.app, [_prefix,
            ...this.getMiddlewareList(_controller, opt),
            (req, res, next) => {
                const _action = _controller[opt.action];
                if (_action instanceof Function) {
                    _action.apply(_controller, [req, res, next]);
                }
            }]);
    }

    initRoutesREST(opt) {
        if (!this.app || !this.helper) {
            return null;
        }
        // ... load controller 
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
                'app': 'app'
            }
        });
        if (!_controller) return null;
        // ... define route list 
        this.app.get.apply(this.app, [_prefix,
            ...this.getMiddlewareList(_controller, opt, 'list'),
            (req, res, next) => {
                _controller.list(req, res, next);
            }]);
        // ... define route select
        this.app.get.apply(this.app, [_prefix + "/:id",
            ...this.getMiddlewareList(_controller, opt, 'select'),
            (req, res, next) => {
                _controller.select(req, res, next);
            }]);
        // ... define route insert
        this.app.post.apply(this.app, [_prefix,
            ...this.getMiddlewareList(_controller, opt, 'insert'),
            (req, res, next) => {
                _controller.insert(req, res, next);
            }]);
        // ... define route update
        this.app.put.apply(this.app, [_prefix + "/:id",
            ...this.getMiddlewareList(_controller, opt, 'update'),
            (req, res, next) => {
                _controller.update(req, res, next);
            }]);
        this.app.patch.apply(this.app, [_prefix + "/:id",
            ...this.getMiddlewareList(_controller, opt, 'update'),
            (req, res, next) => {
                _controller.update(req, res, next);
            }]);
        // ... define route delete
        this.app.delete.apply(this.app, [_prefix + "/:id",
            ...this.getMiddlewareList(_controller, opt, 'delete'),
            (req, res, next) => {
                _controller.delete(req, res, next);
            }]);
        // ... define route clean
        this.app.delete.apply(this.app, [_prefix,
            ...this.getMiddlewareList(_controller, opt, 'clean'),
            (req, res, next) => {
                _controller.clean(req, res, next);
            }]);
        // ... define route options
        this.app.options.apply(this.app, [_prefix,
            ...this.getMiddlewareList(_controller, opt, 'options'),
            (req, res, next) => {
                _controller.options(req, res, next);
            }]);
        // ... define route option
        this.app.options.apply(this.app, [_prefix + "/:id",
            ...this.getMiddlewareList(_controller, opt, 'option'),
            (req, res, next) => {
                _controller.option(req, res, next);
            }]);
    }

    initMiddlewareList(middleware) {
        middleware = middleware || {};
        middleware.global = middleware.global instanceof Array ? middleware.global : [];
        middleware.list = middleware.list instanceof Array ? middleware.list : [];
        middleware.select = middleware.select instanceof Array ? middleware.select : [];
        middleware.insert = middleware.insert instanceof Array ? middleware.insert : [];
        middleware.update = middleware.update instanceof Array ? middleware.update : [];
        middleware.delete = middleware.delete instanceof Array ? middleware.delete : [];
        middleware.clean = middleware.clean instanceof Array ? middleware.clean : [];
        middleware.options = middleware.options instanceof Array ? middleware.options : [];
        middleware.option = middleware.option instanceof Array ? middleware.option : [];
        return middleware;
    }

    getMiddlewareList(controller, opt, action=null){
        try {
            action = action || opt.action;
            if(opt.middleware && opt.method === 'rest'){
                controller.middleware = Object.assign(
                    controller.middleware || {}, 
                    opt.middleware
                );
            }
            const middlewareModule = this.initMiddlewareList(this.middleware);
            const middlewareController = this.initMiddlewareList(controller.middleware);
            const middlewareRoute = opt.middleware && opt.middleware instanceof Array ? opt.middleware : [];
            return [
                ...middlewareModule.global,
                ...middlewareModule[action] instanceof Array ? middlewareModule[action] : [],
                ...middlewareController.global,
                ...middlewareController[action] instanceof Array ? middlewareController[action] : [],
                ...middlewareRoute
            ];
        }
        catch(error) {
            console.log('[ERROR]', error);
            return [];
        }
    }
}
module.exports = Module;