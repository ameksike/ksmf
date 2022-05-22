/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @dependencies express, cors, dotenv, ksdp, compression, cookie-parser, body-parser
 * */
const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');

const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const KsDp = require('ksdp');

class AppWEB {
    /**
     * @description initialize library
     * @param {STRING} path 
     */
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
     * @returns {OBJECT} self
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
            const url = `${this.cfg.srv.protocol}://${this.cfg.srv.host}:${this.cfg.srv.port}`;
            this.emit('onStart', "ksmf", [this.cfg.srv, url]);
            this.setLog('INFO', ['LISTENING SERVER', `${url}`]);
            if (this.cfg.srv.log >= 1) {
                this.setLog('INFO', [this.getRoutes()]);
            }
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
     * @param {STRING} target 
     * @returns {OBJECT}
     */
    loadConfig(target) {
        const fs = require('fs');
        let res = {};
        if (fs.existsSync(target)) {
            try {
                res = require(target);
            } catch (error) {
                return {};
            }
        }
        return res;
    }

    /**
     * @description preload configuration file, variables, environments, etc
     */
    initConfig() {
        dotenv.config();
        const envid = process.env.NODE_ENV || 'development';

        const app = this.loadConfig(this.path + 'cfg/config.json');
        const srv = this.loadConfig(this.path + 'cfg/core.json');

        this.cfg.env = process.env || {};
        this.cfg.envid = envid;
        this.cfg.app = app[envid] || {};
        this.cfg.srv = srv[envid] || {};
        this.cfg.path = this.path;

        this.cfg.srv.module = this.cfg.srv.module || {};
        this.cfg.srv.module.path = this.path + 'src/';
        this.cfg.srv.log = this.cfg.env.LOG_LEVEL ? this.cfg.env.LOG_LEVEL : this.cfg.srv.log;
        this.cfg.srv.port = this.cfg.env.PORT || this.cfg.srv.port;
        this.cfg.srv.event = this.cfg.srv.event || {};
        this.cfg.srv.cors = this.cfg.srv.cors || [];
        this.cfg.srv.public = this.cfg.srv.public || 'www/';
        this.cfg.srv.static = this.cfg.srv.static || '/www';
        this.cfg.srv.doc = this.cfg.srv.doc || {};

        this.cfg.app.logging = this.cfg.srv.log > 0;

        // ... configure Helper ...
        this.helper.configure({
            path: this.cfg.srv.module.path,
            src: this.cfg.srv.helper,
            name: 'helper',
            error: {
                on: (error) => {
                    this.setError(error);
                }
            }
        });
        this.helper.set(this, 'app');
        // ... configure Events ...
        this.initEvents();
        this.emit('onInitConfig', "ksmf", [this.cfg]);
        this.web = express();
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
        this.emit('onInitApp', "ksmf", [this.web]);

        //... Set Error Handler
        this.initErrorHandler();

        //... Allow body Parser
        this.web.use(bodyParser.json());
        this.web.use(bodyParser.urlencoded({
            extended: false
        }));

        //... Allow cookie Parser
        this.web.use(cookieParser());

        //... Allow compression
        this.web.use(compression());

        //... Allow static files
        this.web.use(this.cfg.srv.static, express.static(this.cfg.path + this.cfg.srv.public));

        //... Allow all origin request, CORS on ExpressJS
        let allowedOrigins = this.cfg.srv.cors;
        if (process.env.CORS_ORIGINS) {
            const CORS_ORIGINS = this.cfg && this.cfg.env && this.cfg.env.CORS_ORIGINS ? this.cfg.env.CORS_ORIGINS : [];
            allowedOrigins = allowedOrigins.concat(CORS_ORIGINS.split(','));
        }
        allowedOrigins = allowedOrigins.map(elm => new RegExp(elm));
        const corsConfig = {
            origin: allowedOrigins.concat('null'),
            allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type'],
            maxAge: 86400,
            credentials: true,
        };
        this.web.use(cors(corsConfig));

        //... Log requests 
        this.web.use((req, res, next) => {
            this.emit('onRequest', "ksmf", [req, res, next]);
            this.setLog('INFO', [req.method, req.path]);
            return next();
        })
    }

    /**
     * @description set logging based on a logging handler
     * @param {STRING} type 
     * @param {STRING|OBJECT} data 
     */
    setLog(type, data) {
        const handler = this.helper.get('logger');
        if (handler && handler.log) {
            if (handler.configure) {
                handler.configure({
                    level: (this.cfg && this.cfg.srv && this.cfg.srv.log) ? this.cfg.srv.log : 1,
                    prefix: 'KSMF.WEB',
                    type
                });
            }
            data = data instanceof Array ? data : [data];
            handler.log(...data);
        }
    }

    /**
     * @description throw application error
     * @param {OBJECT} error 
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} next 
     */
    setError(error, req = null, res = null, next = null) {
        this.setLog('ERROR', [error]);
        this.emit('onError', "ksmf", [error, req, res, next]);
        if (res && !res.finished && res.status instanceof Function) {
            res.status(500);
            return res.json({
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
        this.emit('onInitModules', "ksmf", [this.cfg.srv.module.load]);
        const modules = [];
        if (this.cfg.srv.module && this.cfg.srv.module.load) {
            this.cfg.srv.module.load.forEach(item => {
                const name = (typeof (item) === 'string') ? item : item.name;
                const options = {
                    // ... EXPRESS APP
                    app: this.web,
                    web: this.web,
                    // ... DATA ACCESS OBJECT 
                    opt: {
                        // ... CONFIGURE 
                        'cfg': this.cfg.app,
                        'srv': this.cfg.srv,
                        // ... ENV
                        'env': this.cfg.env,
                        'envid': this.cfg.envid,
                        // ... PATH
                        'path': {
                            'prj': this.path,
                            'mod': this.cfg.srv.module.path + name + "/",
                            'app': this.cfg.srv.module.path + "app/",
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
                const obj = this.helper.get(item);
                if (obj) {
                    modules.push(obj);
                    this.emit('onLoadModule', "ksmf", [obj, name, this.cfg.srv.module.path + name + "/model/"]);
                }
            });
        }
        this.emit('onLoadedModules', "ksmf", [modules]);
    }

    /**
     * @description load application routes
     */
    initRoutes() {
        this.emit('onInitRoutes', "ksmf", [this.cfg.srv.route]);
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
                    this.emit('onLoadRoutes', "ksmf", [i, route, this.web]);
                }
            }
        }

        this.web.get('*', (req, res, next) => {
            this.emit('on404', "ksmf", [req, res, next]);
            this.setLog('WARN', ['404', req.method, req.path]);
            next();
        });
    }

    /**
     * @description get list of available routes
     * @returns {ARRAY}
     */
    getRoutes() {
        const list = [];
        const epss = [];
        function print(path, layer) {
            if (layer.route) {
                layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
            } else if (layer.name === 'router' && layer.handle.stack) {
                layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
            } else if (layer.method) {
                const endpoint = `${layer.method.toUpperCase()} ${path.concat(split(layer.regexp)).filter(Boolean).join('/')}`;
                if (epss.indexOf(endpoint) === -1) {
                    epss.push(endpoint);
                    list.push([layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join('/')]);
                }
            }
        }
        function split(thing) {
            if (typeof thing === 'string') {
                return thing.split('/')
            } else if (thing.fast_slash) {
                return ''
            } else {
                var match = thing.toString()
                    .replace('\\/?', '')
                    .replace('(?=\\/|$)', '$')
                    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
                return match ?
                    match[1].replace(/\\(.)/g, '$1').split('/') :
                    '<complex:' + thing.toString() + '>'
            }
        }
        if (this.web && this.web._router && this.web._router.stack) {
            this.web._router.stack.forEach(print.bind(null, []));
        }
        return list;
    }

    /**
     * @description safely trigger events
     */
    emit() {
        if (this.event && this.event.emit instanceof Function) {
            this.event.emit(...arguments);
        }
    }
}

module.exports = AppWEB;