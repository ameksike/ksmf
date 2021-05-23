/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @dependencies express cors dotenv ksdp
 * */
const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');

const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const KsDp = require('ksdp');

class AppWEB {

    constructor(path) {
        this.option = {
            app: {},
            srv: {}
        };
        this.path = path;
        this.web = express();
        this.mod = [];
        this.cfg = {};
        this.helper = new KsDp.integration.IoC();
        this.event = new KsDp.behavioral.Observer();
    }

    init() {
        try {
            this.initConfig();
            this.initApp();
            this.initModules();
            this.initRoutes();
        } catch (error) {
            this.setError(error);
        }
        return this;
    }

    run() {
        return this.web.listen(this.cfg.srv.port, () => {
            const url = `${this.cfg.srv.protocol}://${this.cfg.srv.host}:${this.cfg.srv.port}`;
            if (this.event && this.event.emit instanceof Function) {
                this.event.emit('onStart', "ksmf", [this.cfg.srv, url]);
            }
            this.setLog('info', ['LISTENING SERVER', `${url}`]);
            if (this.cfg.srv.log >= 1) {
                this.setLog('info', [this.getRoutes()]);
            }
        });
    }

    start() {
        this.run();
    }

    stop() {
        if (this.event && this.event.emit instanceof Function) {
            this.event.emit('onStop', "ksmf", [this.web]);
        }
        if (this.dao && this.dao.disconnect instanceof Function) {
            this.dao.disconnect();
        }
        if (this.web && this.web.close instanceof Function) {
            this.web.close();
        }
    }

    initConfig() {
        dotenv.config();
        const envid = process.env.NODE_ENV || 'development';
        const app = require(this.path + 'cfg/config.json') || {};
        const srv = require(this.path + 'cfg/core.json') || {};

        this.cfg.env = process.env;
        this.cfg.envid = envid;
        this.cfg.app = app[envid] || {};
        this.cfg.srv = srv[envid] || {};
        this.cfg.path = this.path;

        this.cfg.srv.module = this.cfg.srv.module || {};
        this.cfg.srv.module.path = this.path + 'src/';
        this.cfg.srv.log = this.cfg.env.LOGGER_DB === 'true' ? 1 : this.cfg.srv.log;
        this.cfg.srv.port = this.cfg.env.PORT || this.cfg.srv.port;
        this.cfg.srv.event = this.cfg.srv.event || {};
        this.cfg.srv.cors = this.cfg.srv.cors || [];

        this.cfg.app.url = this.cfg.env.DATABASE_URL;
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
        if (this.event && this.event.emit instanceof Function) {
            this.event.emit('onInitConfig', "ksmf", [this.cfg]);
        }
    }

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

    initApp() {
        if (this.event && this.event.emit instanceof Function) {
            this.event.emit('onInitApp', "ksmf", [this.web]);
        }

        //... Set Error Handler
        this.web.use((err, req, res, next) => {
            if (this.event && this.event.emit instanceof Function) {
                this.event.emit('onError', "ksmf", [err, req, res, next]);
            }
            this.setError(err, req, res, next);
        });

        //... Allow body Parser
        this.web.use(bodyParser.json());
        this.web.use(bodyParser.urlencoded({ extended: false }));

        //... Allow cookie Parser
        this.web.use(cookieParser());

        //... Allow compression
        this.web.use(compression());

        //... Allow all origin request, CORS on ExpressJS
        let allowedOrigins = this.cfg.srv.cors;
        if (process.env.CORS_ORIGINS) {
            const CORS_ORIGINS = this.cfg && this.cfg.env && this.cfg.env.CORS_ORIGINS ? this.cfg.env.CORS_ORIGINS : [];
            allowedOrigins = allowedOrigins.concat(CORS_ORIGINS.split(','));
        }
        allowedOrigins = allowedOrigins.map(elm => new RegExp(elm));
        const corsConfig = {
            origin: allowedOrigins,
            allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type'],
            maxAge: 86400,
            credentials: true,
        };
        this.web.use(cors(corsConfig));

        //... Log requests 
        this.web.use((req, res, next) => {
            if (this.event && this.event.emit instanceof Function) {
                this.event.emit('onRequest', "ksmf", [req, res, next]);
            }
            this.setLog('info', [`${req.method} : ${req.path}`]);
            return next();
        })
    }

    setLog(type, data) {
        const handler = this.helper.get('logger');
        if (handler && handler.log) {
            if (handler.configure) {
                handler.configure({
                    level: (this.cfg && this.cfg.srv && this.cfg.srv.log) ? this.cfg.srv.log : 1,
                    prefix: 'KsMf.Web',
                    type
                });
            }
            handler.log(...data);
        }
    }

    setError(error, req = null, res = null, next = null) {
        this.setLog('error', [error]);
        if (this.event && this.event.emit instanceof Function) {
            this.event.emit('onError', "ksmf", [error, req, res, next]);
        }
        const handler = this.helper.get('error');
        if (handler && handler.on) {
            handler.on(error, req, res, next);
        }
    }

    initModules() {
        if (this.event && this.event.emit instanceof Function) {
            this.event.emit('onInitModules', "ksmf", [this.cfg.srv.module.load]);
        }
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
                if (obj && this.event && this.event.emit instanceof Function) {
                    this.event.emit('onLoadModule', "ksmf", [obj, name, this.cfg.srv.module.path + name + "/model/"]);
                }
            });
        }
    }

    initRoutes() {
        if (this.event && this.event.emit instanceof Function) {
            this.event.emit('onInitRoutes', "ksmf", [this.cfg.srv.route]);
        }

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

                    if (this.event && this.event.emit instanceof Function) {
                        this.event.emit('onLoadRoutes', "ksmf", [i, route, this.web]);
                    }
                }
            }
        }

        this.web.get('*', (req, res, next) => {
            if (this.event && this.event.emit instanceof Function) {
                this.event.emit('on404', "ksmf", [req, res, next]);
            }
            this.setLog('error', ['404', `${req.method} : ${req.path}`]);
            next();
        });
    }

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
}

module.exports = AppWEB;