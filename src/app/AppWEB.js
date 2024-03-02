/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.3
 * @dependencies express-session, dotenv, ksdp, cookie-parser
 **/
const dotenv = require('dotenv');
const path = require('path');
const KsDp = require('ksdp');
const Server = require('../server/ExpressServer');
const Config = require('./Config');

class AppWEB {

    /**
     * @type {Object|null}
     */
    helper = null;

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
     * @type {Console|null}
     */
    logger = null;

    /**
     * @description initialize library
     * @param {String} path 
     **/
    constructor(path) {
        this.option = {
            app: {},
            srv: {}
        };
        this.path = path;
        this.web = null;
        this.mod = [];
        this.cfg = {};
        this.helper = new KsDp.integration.IoC();
        this.event = new KsDp.behavioral.Observer();
        this.config = new Config();
    }

    /**
     * @description register a plugin
     * @param {Object|String|Function|Array} plugin 
     * @param {Object} [option] 
     * @returns {AppWEB} self
     */
    register(plugin, option = 'default') {
        this.helper?.set(plugin, option);
        return this;
    }

    /**
     * @description remove a plugin
     * @param {Object|String|Function|Array} plugin 
     * @param {Object} option 
     * @returns {AppWEB} self
     */
    unregister(plugin = 'default', option = null) {
        this.helper?.del(plugin, option);
        return this;
    }

    /**
     * @description add listener to event
     * @param {Array|Object|Function} subscriber 
     * @param {String} [event]
     * @param {Object} [option] 
     * @param {String} [option.event] 
     * @param {String} [option.scope] 
     * @param {Number} [option.index]
     * @param {Array} [option.rows]
     * @return {AppWEB} self
     */
    subscribe(subscriber, event, option = null, scope = 'ksmf') {
        this.event?.subscribe(subscriber, event, scope, option);
        return this;
    }

    /**
     * @description remove listener from event
     * @param {String} event 
     * @param {Object} [option] 
     * @param {Number} [option.index] 
     * @param {String} [option.event] 
     * @param {String} [option.scope] 
     * @param {Number} [option.count] 
     * @param {Array} [option.rows] 
     * @return {AppWEB} self-reference
     */
    unsubscribe(event, option = null, scope = 'ksmf') {
        this.event?.unsubscribe(event, scope, option);
        return this;
    }

    /**
     * @description safely trigger events
     * @param {String} event 
     * @param {Array} params 
     * @param {String} scope 
     * @returns {AppWEB} self
     */
    emit(event, params = [], scope = 'ksmf') {
        this.event?.emit instanceof Function && this.event.emit(event, scope, params);
        return this;
    }

    /**
     * @description Initialize the application (Implement template method pattern)
     * @param {Object} [options]
     * @param {Object} [options.web] 
     * @param {Boolean} [options.cookie] 
     * @returns {Promise<AppWEB>} self
     */
    async init(options = null) {
        try {
            await this.initConfig();
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
     * @description start server 
     * @param {Object} [options]
     */
    async run(options = null) {
        if (!this.server) {
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
        }]);
    }

    /**
     * @description alias for run method
     */
    start() {
        this.run();
    }

    /**
     * @description stop server 
     */
    stop() {
        const server = this.getServer();
        this.emit('onStop', [server]);
        server?.stop();
    }

    /**
     * @description preload configuration file, variables, environments, etc
     */
    initConfig() {
        dotenv.config();
        const env = process.env || {};
        const eid = env["NODE_ENV"] || 'development';
        const srv = this.config.load('cfg/core.json', { dir: this.path, id: eid });
        const pac = this.config.load(path.join(this.path, 'package.json'));

        this.cfg.env = env;
        this.cfg.eid = eid;
        this.cfg.srv = srv;
        this.cfg.path = this.path;
        this.cfg.pack = pac;

        this.cfg.srv.module = this.cfg.srv.module || {};
        this.cfg.srv.module.path = path.join(this.path, 'src/');
        this.cfg.srv.log = this.cfg.env.LOG_LEVEL ? this.cfg.env.LOG_LEVEL : this.cfg.srv.log;
        this.cfg.srv.port = this.cfg.env.PORT || this.cfg.srv.port;
        this.cfg.srv.event = this.cfg.srv.event || {};
        this.cfg.srv.cors = this.cfg.srv.cors || [];
        this.cfg.srv.public = this.cfg.srv.public || 'www/';
        this.cfg.srv.static = this.cfg.srv.static || '/www';
        this.cfg.srv.doc = this.cfg.srv.doc || {};

        // ... configure Helper ...
        this.helper.configure({
            path: this.cfg.srv.module.path,
            src: this.cfg.srv.helper,
            name: 'helper',
            error: {
                on: (error) => this.setError(error)
            }
        });
        this.helper.set(this, 'app');
        // ... configure Events ...
        this.initEvents();
        this.emit('onInitConfig', [this.cfg]);
        return this;
    }

    /**
     * @description get the web server
     * @param {Object} [options]
     * @param {Object} [options.web] 
     * @param {Boolean} [options.cookie] 
     * @param {Boolean} [options.force] 
     * @returns {Promise<any>} server
     */
    async getServer(options = null) {
        if (this.server) {
            return this.server;
        }
        this.server = this.helper.get('server');
        if (!this.server) {
            this.server = new Server();
            this.helper.set(this.server, 'server');
        }
        if (!this.server.web || options?.force) {
            await this.server.configure(options);
        }
        // maintain backward compatibility
        this.web = this.server.web;
        this.drv = this.server.drv;
        return this.server;
    }

    /**
     * @description initialize event handler 
     */
    initEvents() {
        for (let event in this.cfg.srv.event) {
            const eventList = this.cfg.srv.event[event];
            for (let elm in eventList) {
                const subscriber = eventList[elm];
                if (this.event && this.event.add instanceof Function) {
                    this.event.add(this.helper.get(subscriber), event, "ksmf");
                }
            }
        }
        return this;
    }

    /**
     * @description initialize middleware applications
     * @param {Object} [options]
     * @param {Object} [options.web] 
     * @param {Boolean} [options.cookie] 
     */
    async initApp(options = null) {
        const server = await this.getServer(options);

        this.emit('onInitApp', [server, this]);

        //... Allow static files
        server.publish(this.cfg.srv.static, path.join(this.cfg.path, this.cfg.srv.public));

        //... Log requests 
        server.onRequest((req, res, next) => {
            this.emit('onRequest', [req, res, next]);
            next instanceof Function && next();
        });

        //... init Error Handler
        server.onError((err, req, res, next) => this.setError(err, req, res, next));
        return this;
    }

    /**
     * @description throw application error
     * @param {Object} error 
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next 
     */
    setError(error, req = null, res = null, next = null) {
        this.emit('onError', [error, req, res, next]);
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
     * @description load modules 
     */
    initModules() {
        this.emit('onInitModules', [this.cfg.srv.module.load, this]);
        const modules = [];
        if (this.cfg?.srv?.module?.load) {
            this.cfg.srv.module.load.forEach(item => this.initModule(item, modules));
        }
        this.emit('onLoadedModules', [modules, this]);
        this.modules = modules;
        return this;
    }

    /**
     * @typedef {Object} TOption
     * @property {String} [item.name] 
     * @property {String} [item.type] 
     * @property {Object} [item.options] 
     * @property {Object} [item.params] 
     * @property {Object} [item.dependency] 
     * 
     * @description initialize a module
     * @param {TOption|String} item 
     * @param {Array} modules 
     * @returns {Object} module
     */
    initModule(item, modules) {
        const name = (typeof (item) === 'string') ? item : item.name;
        const options = {
            // ... EXPRESS APP
            frm: this,
            app: this.server,
            web: this.web,
            drv: this.drv,
            // ... DATA ACCESS Object 
            opt: {
                // ... CONFIGURE 
                'cfg': this.cfg.srv,
                // ... ENV
                'env': this.cfg.env,
                'eid': this.cfg.eid,
                // ... PATH
                'path': {
                    'prj': path.resolve(this.path),
                    'mod': path.join(this.cfg.srv.module.path, name),
                    'app': path.join(this.cfg.srv.module.path, "app")
                },
                // ... NAME
                'name': name,
                'prefix': this.cfg.srv?.prefix || ""
            }
        };
        const dependency = { 'helper': 'helper' };
        if (typeof (item) === 'string') {
            item = {
                options,
                dependency,
                name,
                type: 'module'
            };
        } else {
            item.options = {
                ...item.options,
                ...item.params,
                ...options
            };
            item.dependency = {
                ...item.dependency,
                ...dependency
            };
        }
        let obj = this.helper.get(item);
        if (!obj) {
            item.type = 'lib';
            obj = this.helper.get(item);
        }
        if (obj) {
            modules?.push(obj);
            this.emit('onLoadModule', [obj, name, path.join(this.cfg.srv.module.path, name, "model"), this]);
        }
        return obj;
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
            this.emit('on404', [req, res, next]);
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