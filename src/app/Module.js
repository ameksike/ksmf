/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
class Module {

    /**
     * @type {Object|null}
     */
    helper = null;

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @type {Object|null}
     */
    _ = null;

    /**
     * @description initialize module
     * @param {Object} payload 
     * @param {Object} [payload.app] 
     * @param {Object} [payload.web]
     * @param {Object} [payload.opt] 
     */
    constructor(payload) {
        this.configure(payload);
    }

    /**
     * @description initialize module
     * @param {Object} payload 
     * @param {Object} [payload.app] 
     * @param {Object} [payload.web]
     * @param {Object} [payload.drv]
     * @param {Object} [payload.opt] 
     * @param {Object} [payload.rest] 
     * @param {Object} [payload.routes] 
     * @param {Object} [payload.prefix] 
     * @param {Object} [payload.middleware] 
     * @returns {Module} self
     */
    configure(payload) {
        this.app = payload?.app || this.app || null;
        this.web = payload?.web || this.web || null;
        this.drv = payload?.drv || this.drv || null;
        this.opt = payload?.opt || this.opt || null;

        this.name = this.opt?.name || "";
        this.prefix = payload?.prefix || payload?.opt?.prefix || "/" + this.name;
        this.rest = payload?.rest ?? this.rest ?? true;
        this.routes = payload?.routes || this.routes || [];

        this.middleware = this.initMiddlewareList(payload?.middleware || this.middleware);
        return this;
    }

    /**
     * @description implement template method pattern
     */
    init() {
        this.initConfig();
        this.initApp();
        this.initRoutes();
    }

    /**
     * @description allow customized application initialization by module
     */
    initApp() {
        // TODO document why this method 'initApp' is empty  
    }

    /**
     * @description allow customized config initialization by module
     */
    initConfig() {
        this.routes.push({
            route: this.prefix,
            controller: 'DefaultController',
            path: 'controller'
        });
    }

    /**
     * @description allow customized routes initialization by module
     */
    initRoutes() {
        for (const i in this.routes) {
            const route = this.routes[i];
            route.method = route.method || 'rest';
            if (this.rest && route.method === 'rest') {
                this.initRouterREST(route);
            }
            this.initRouterWeb(route);
        }
    }

    /**
     * @description allow customized web routes initialization by module
     * @param {Object} opt
     * @param {String} [opt.route]
     * @param {String} [opt.action]
     * @param {String} [opt.name]
     * @param {String} [opt.controller]
     * @param {String} [opt.method]
     * @param {String} [opt.path]
     */
    initRouterWeb(opt) {
        if (!opt?.action || !this.app || !this.helper || typeof (this.app[opt.method]) !== 'function') return;
        // ... load controller 
        const _locator = this.getLocator(opt);
        const _prefix = _locator?.route || opt?.route;
        const _controller = this.helper.get(_locator);
        // ... define routes  
        this.app.set({
            method: opt.method,
            route: _prefix,
            middlewares: this.getMiddlewareList(_controller, opt) || [],
            handler: (req, res, next) => {
                const _action = _controller[opt.action];
                if (_action instanceof Function) {
                    _action.apply(_controller, [req, res, next]);
                }
            }
        });
    }
    /**
     * @description allow customized REST routes initialization by module
     * @param {Object} opt
     * @param {String} [opt.route]
     * @param {String} [opt.name]
     * @param {String} [opt.controller]
     * @param {String} [opt.path]
     */
    initRouterREST(opt) {
        if (!this.app || !this.helper) {
            return null;
        }
        // ... load controller 
        const _locator = this.getLocator(opt);
        const _prefix = _locator?.route || opt?.route;
        const _controller = this.helper.get(_locator);
        if (!_controller) return null;
        // ... define route select
        this.app.set({
            method: 'get',
            route: (_prefix + '/:id').replace(/[\/\/]+/g, '/'),
            middlewares: this.getMiddlewareList(_controller, opt, 'select') || [],
            handler: (req, res, next) => _controller.select(req, res, next)
        });
        // ... define route clone
        this.app.set({
            method: 'post',
            route: (_prefix + '/:id').replace(/[\/\/]+/g, '/'),
            middlewares: this.getMiddlewareList(_controller, opt, 'clone') || [],
            handler: (req, res, next) => _controller.clone(req, res, next)
        });
        // ... define route update
        this.app.set({
            method: 'put',
            route: (_prefix + '/:id').replace(/[\/\/]+/g, '/'),
            middlewares: this.getMiddlewareList(_controller, opt, 'update') || [],
            handler: (req, res, next) => _controller.update(req, res, next)
        });
        this.app.set({
            method: 'patch',
            route: (_prefix + '/:id').replace(/[\/\/]+/g, '/'),
            middlewares: this.getMiddlewareList(_controller, opt, 'update') || [],
            handler: (req, res, next) => _controller.update(req, res, next)
        });
        // ... define route delete
        this.app.set({
            method: 'delete',
            route: (_prefix + '/:id').replace(/[\/\/]+/g, '/'),
            middlewares: this.getMiddlewareList(_controller, opt, 'delete') || [],
            handler: (req, res, next) => _controller.delete(req, res, next)
        });
        // ... define route option
        this.app.set({
            method: 'options',
            route: (_prefix + '/:id').replace(/[\/\/]+/g, '/'),
            middlewares: this.getMiddlewareList(_controller, opt, 'option') || [],
            handler: (req, res, next) => _controller.option(req, res, next)
        });
        // ... define route list 
        this.app.set({
            method: 'get',
            route: _prefix,
            middlewares: this.getMiddlewareList(_controller, opt, 'list') || [],
            handler: (req, res, next) => _controller.list(req, res, next)
        });
        // ... define route insert
        this.app.set({
            method: 'post',
            route: _prefix,
            middlewares: this.getMiddlewareList(_controller, opt, 'insert') || [],
            handler: (req, res, next) => _controller.insert(req, res, next)
        });
        // ... define route options
        this.app.set({
            method: 'options',
            route: _prefix,
            middlewares: this.getMiddlewareList(_controller, opt, 'options') || [],
            handler: (req, res, next) => _controller.options(req, res, next)
        });
        // ... define route clean
        this.app.set({
            method: 'delete',
            route: _prefix,
            middlewares: this.getMiddlewareList(_controller, opt, 'clean') || [],
            handler: (req, res, next) => _controller.clean(req, res, next)
        });
    }

    /**
     * @description get IoC locator options 
     * @param {Object} opt
     * @param {String} [opt.route]
     * @param {String} [opt.name]
     * @param {String} [opt.controller]
     * @param {String} [opt.path]
     * @param {String} [opt.strict] 
     * @param {Object} [opt.params] 
     * @param {Object} [opt.options] 
     * @param {Object} [opt.dependency] 
     * @returns {Object} locator
     */
    getLocator(opt) {
        opt = typeof opt === 'string' ? { name: opt } : opt;
        if (opt.strict) {
            return opt;
        }
        return {
            name: opt.controller,
            path: opt.path || 'controller',
            module: this.name,
            moduleType: this.type || this._?.type,
            options: {
                opt: this.opt,
                module: this.name,
                ...opt.options,
                ...opt.params
            },
            dependency: {
                'helper': 'helper',
                'app': 'app',
                ...opt.dependency
            }
        }
    }

    /**
     * @description get middleware list by controller
     * @param {Object} controller 
     * @param {Object} opt 
     * @param {String} action 
     * @returns {Array} middlewares
     */
    getMiddlewareList(controller, opt, action = null) {
        try {
            action = action || opt.action;
            if (opt.middleware && opt.method === 'rest') {
                controller.middleware = Object.assign(
                    controller.middleware || {},
                    opt.middleware
                );
            }
            const middlewareModule = this.initMiddlewareList(this.middleware);
            const middlewareController = this.initMiddlewareList(controller.middleware);
            const middlewareRoute = opt.middleware && opt.middleware instanceof Array ? opt.middleware : [];
            this.drv?.json instanceof Function && middlewareModule.global.push(this.drv.json());
            return [
                ...middlewareModule.global,
                ...middlewareModule[action] instanceof Array ? middlewareModule[action] : [],
                ...middlewareController.global,
                ...middlewareController[action] instanceof Array ? middlewareController[action] : [],
                ...middlewareRoute
            ];
        }
        catch (error) {
            console.log('[ERROR]', error);
            return [];
        }
    }

    /**
     * @description initialize module middleware list
     * @param {Object} middleware 
     * @returns {Object} middleware
     */
    initMiddlewareList(middleware, actions = null) {
        actions = actions || ['global', 'list', 'select', 'insert', 'update', 'delete', 'clone', 'clean', 'option', 'options'];
        middleware = middleware || {};
        for (let action of actions) {
            middleware[action] = middleware[action] instanceof Array ? middleware[action] : [];
        }
        return middleware;
    }
}
module.exports = Module;