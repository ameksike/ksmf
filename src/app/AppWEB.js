/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.3
 * @dependencies express, express-session, dotenv, ksdp, cookie-parser
 **/
const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const KsDp = require('ksdp');

class AppWEB {
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
    }

    /**
     * @description initialize serve (Implement template method pattern)
     * @returns {Object} self
     */
    init() {
        try {
            this.initConfig();
            this.initApp();
            this.initModules();
            this.initRoutes();
            this.initErrorHandler();
            this.emit('onInitCompleted', "ksmf", [this]);
        } catch (error) {
            this.setError(error);
        }
        return this;
    }

    /**
     * @description start server 
     */
    run() {
        if (!this.web) {
            this.init();
        }
        return this.web.listen(this.cfg.srv.port, () => {
            this.emit('onStart', "ksmf", [{
                srv: this.cfg.srv,
                message: 'LISTENING SERVER',
                url: `${this.cfg.srv.protocol}://${this.cfg.srv.host}:${this.cfg.srv.port}`
            }]);
        });
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
        this.emit('onStop', "ksmf", [this.web]);
        if (this.dao && this.dao.disconnect instanceof Function) {
            this.dao.disconnect();
        }
        if (this.web && this.web.close instanceof Function) {
            this.web.close();
        }
    }

    /**
     * @description load file config
     * @param {String} target 
     * @returns {Object}
     */
    loadConfig(target, dir, id) {
        try {
            let file = dir ? path.join(dir, target) : target;
            let tmp = require(file) || {};
            tmp = tmp[id] || tmp["default"] || tmp || {};
            if (tmp.import) {
                for (let i in tmp.import) {
                    if (tmp.import[i]) {
                        if (!isNaN(i)) {
                            Object.assign(tmp, this.loadConfig(tmp.import[i], dir, id));
                        } else {
                            tmp[i] = this.loadConfig(tmp.import[i], dir, id);
                        }
                    }
                }
            }
            return tmp;
        } catch (error) {
            console.log(JSON.stringify({
                flow: String(Date.now()) + "00",
                level: 1,
                src: "KsMf:App:loadConfig",
                error: error?.message,
                data: { target, dir, id }
            }));
            return {};
        }
    }

    /**
     * @description preload configuration file, variables, environments, etc
     */
    initConfig() {
        dotenv.config();
        const env = process.env || {};
        const eid = env["NODE_ENV"] || 'development';
        const srv = this.loadConfig('cfg/core.json', this.path, eid);
        const pac = this.loadConfig(path.join(this.path, 'package.json'));

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
        this.emit('onInitConfig', "ksmf", [this.cfg]);
        this.web = express();
        this.drv = express;
        return this;
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
     * @description set error handler middleware
     */
    initErrorHandler() {
        this.web.use((err, req, res, next) => {
            this.setError(err, req, res, next);
        });
    }

    /**
     * @description initialize middleware applications
     */
    initApp() {
        this.emit('onInitApp', "ksmf", [this.web, this]);

        //... Allow cookie Parser
        this.web.use(cookieParser());

        //... Allow body Parser
        this.web.use(express.urlencoded({ extended: true }));

        //... Allow session
        this.web.use(session({
            resave: true,
            saveUninitialized: true,
            secret: process?.env?.SESSION_KEY || 'ksksksks'
        }));

        //... Allow static files
        this.web.use(this.cfg.srv.static, express.static(path.join(this.cfg.path, this.cfg.srv.public)));

        //... Log requests 
        this.web.use((req, res, next) => {
            this.emit('onRequest', "ksmf", [req, res, next]);
            return next();
        });
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
        this.emit('onError', "ksmf", [error, req, res, next]);
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
        this.emit('onInitModules', "ksmf", [this.cfg.srv.module.load, this]);
        const modules = [];
        if (this.cfg?.srv?.module?.load) {
            this.cfg.srv.module.load.forEach(item => {
                const name = (typeof (item) === 'string') ? item : item.name;
                const options = {
                    // ... EXPRESS APP
                    app: this.web,
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
                        'name': name
                    }
                };

                const dependency = {
                    'helper': 'helper'
                };

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
                        ...options
                    };
                    item.dependency = {
                        ...item.dependency,
                        ...dependency
                    };
                }
                let obj = this.helper.get(item);
                if (!obj) {
                    obj = this.helper.get({
                        options,
                        dependency,
                        name,
                        type: 'lib'
                    });
                }

                if (obj) {
                    modules.push(obj);
                    this.emit('onLoadModule', "ksmf", [obj, name, path.join(this.cfg.srv.module.path, name, "model"), this]);
                }
            });
        }
        this.emit('onLoadedModules', "ksmf", [modules, this]);
        this.modules = modules;
        return this;
    }

    /**
     * @description load application routes
     */
    initRoutes() {
        this.emit('onInitRoutes', "ksmf", [this.cfg.srv.route, this]);
        if (this.cfg.srv.route) {
            for (const i in this.cfg.srv.route) {
                const route = this.cfg.srv.route[i];
                if (this.web[route.method]) {
                    this.web[route.method](i, (req, res, next) => {
                        route.path = route.path || 'controller';
                        route.name = route.name || route.controller;
                        const controller = this.helper.get(route);
                        if (!controller || !controller[route.action]) {
                            this.setError(`404 on '${route.module}:${route.controller}:${route.action}'`, req, res, next);
                        }
                        controller[route.action](req, res, next);
                    });
                    this.emit('onLoadRoutes', "ksmf", [i, route, this.web, this]);
                }
            }
        }

        this.web.get('*', (req, res, next) => {
            this.emit('on404', "ksmf", [req, res, next]);
            next();
        });
        return this;
    }

    /**
     * @description safely trigger events
     */
    emit() {
        this.event?.emit instanceof Function && this.event.emit(...arguments);
        return this;
    }
}

module.exports = AppWEB;