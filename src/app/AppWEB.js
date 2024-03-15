/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.3
 * @requires    dotenv
 * @requires    ksdp
 **/
const path = require('path');
const Server = require('../server/BaseServer');
const App = require('./App');

class AppWEB extends App {
    /**
     * @deprecated
     * @type {Object|null}
     */
    web = null;

    /**
     * @deprecated
     * @type {Object|null}
     */
    drv = null;

    /**
     * @type {Object|null}
     */
    server = null;

    /**
     * @type {Object|null}
     */
    option = null;

    constructor(option = null) {
        super(option);
        this.web = null;
        this.option = {
            app: {},
            srv: {}
        };
    }

    /**
     * @description start server 
     * @param {import('../types').TAppConfig} [options] 
     */
    async run(options = null) {
        if (!this.server || options?.force) {
            await this.init(options);
        }

        let metadata = await this.server?.start({
            port: this.cfg?.srv?.port,
            host: this.cfg?.srv?.host,
        });

        this.emit('onStart', [{
            srv: this.cfg?.srv,
            message: 'SERVER_LISTENING',
            ...metadata
        }, this]);
    }

    /**
     * @description alias for start server 
     * @param {import('../types').TAppConfig} [options]
     */
    start(options = null) {
        this.run(options);
    }

    /**
     * @description stop server 
     */
    async stop() {
        const server = await this.getServer();
        this.emit('onStop', [server, this]);
        server?.stop();
    }

    /**
     * @description get the web server
     * @param {import('../types').TAppConfig} [options]
     * @returns {Promise<import('../server/BaseServer')>} server
     */
    async getServer(options = null) {
        if (this.server) {
            return this.server;
        }
        this.server = this.helper.get('server');
        if (!this.server) {
            this.server = this.helper.get({ name: 'ksmf-express', type: 'package' }) || new Server();
            this.helper.set(this.server, 'server');
        }
        if (!this.server.configured || options?.force) {
            await this.server.configure(options);
        }
        // maintain backward compatibility
        this.web = this.server.web;
        this.drv = this.server.drv;
        return this.server;
    }

    /**
     * @description throw application error
     * @param {Object} error 
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next 
     */
    setError(error, req = null, res = null, next = null) {
        this.emit('onError', [error, req, res, next, this]);
        if (res && !res.finished && res.status instanceof Function) {
            return res.status(500).json({
                error: typeof (error) === 'string' ? {
                    message: error
                } : {
                    code: error.code,
                    message: error.message
                }
            });
        }
    }

    /**
     * @description Initialize the application (Implement template method pattern)
     * @param {import('../types').TAppConfig} [options]
     * @returns {Promise<AppWEB>} self
     */
    async init(options = null) {
        try {
            options = options || {};
            await this.initLoad(options);
            await this.initConfig(options);
            await this.initApp(options);
            await this.initModules();
            await this.initRoutes();
            this.emit('onInitCompleted', [this]);
        } catch (error) {
            this.setError(error);
        }
        return this;
    }

    /**
     * @description preload configuration file, variables, environments, etc
     * @param {import('../types').TAppConfig} [options]
     */
    initConfig(options) {
        // ... set default values ...
        this.cfg.srv.cors = this.cfg.srv.cors || {};
        this.cfg.srv.public = this.cfg.srv.public || 'www/';
        this.cfg.srv.static = this.cfg.srv.static || '/www';
        this.cfg.srv.port = this.cfg.env.PORT || this.cfg.srv.port || 4444;

        // ... configure component options ...
        options = options || {};
        options.cors = options.cors || this.cfg.srv.cors || null;
        options.fingerprint = options.fingerprint || this.cfg.srv.fingerprint || null;
        options.cookie = options.cookie || this.cfg.srv.cookie || null;
        options.session = options.session || this.cfg.srv.session || null;
        options.force = options.force || this.cfg.srv.force || false;
        options.server = options.server || this.cfg.srv.server || false;
        return super.initConfig(options);;
    }

    /**
     * @description initialize the module options 
     * @returns {Object}
     */
    initModuleOpts() {
        return {
            server: this.server,
            web: this.web,
            drv: this.drv
        }
    }

    /**
     * @description initialize middleware applications
     * @param {import('../types').TAppConfig} [options]
     */
    async initApp(options = null) {
        this.server = options?.server || await this.getServer(options);

        this.server?.initCors(options?.cors);
        this.server?.initFingerprint(options?.fingerprint);
        this.server?.initCookie(options?.cookie);
        this.server?.initSession(options?.session);

        this.emit('onInitApp', [this.server, this]);

        //... Allow static files
        this.server?.publish(this.cfg.srv.static, path.join(this.cfg.path, this.cfg.srv.public));

        //... Log requests 
        this.server?.onRequest((req, res, next) => {
            this.emit('onRequest', [req, res, next, this]);
            next instanceof Function && next();
        });

        //... init Error Handler
        this.server?.onError((err, req, res, next) => this.setError(err, req, res, next));
        return this;
    }

    /**
     * @description load application routes
     * @returns {AppWEB} self
     */
    initRoutes() {
        this.emit('onInitRoutes', [this.cfg.srv.route, this]);
        if (this.cfg?.srv?.route) {
            for (const i in this.cfg.srv.route) {
                const route = this.cfg.srv.route[i];
                this.initRoute(route, i);
            }
        }
        this.server?.on404((req, res, next) => {
            this.emit('on404', [req, res, next, this]);
            next instanceof Function && next();
        });
        return this;
    }

    /**
     * @description initialize a route
     * @param {Object} route 
     * @param {String} [route.id]
     * @param {String} [route.name]
     * @param {String} [route.action]
     * @param {String} [route.controller]
     * @param {String} [route.module] 
     * @param {String} [route.method] 
     * @param {String} [route.path] 
     * @param {String} pathname 
     * @returns {Object} route
     */
    initRoute(route, pathname) {
        if (route && pathname && this.server?.set instanceof Function) {
            this.server.set({
                route: pathname,
                method: route.method,
                handler: (req, res, next) => {
                    route.path = route.path || 'controller';
                    route.name = route.name || route.controller;
                    const controller = this.helper.get(route);
                    if (!controller || !controller[route.action]) {
                        this.setError(`404 on '${route.module}:${route.controller}:${route.action}'`, req, res, next);
                    }
                    controller[route.action] instanceof Function && controller[route.action](req, res, next);
                }
            });
            this.emit('onLoadRoutes', [pathname, route, this.server, this]);
        }
        return route;
    }
}

module.exports = AppWEB;