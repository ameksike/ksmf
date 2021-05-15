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
            this.event.emit('onStart', "ksmf", [this.cfg.srv, url]);
            this.setLog(`>>> SERVER: ${url}`);
            if (this.cfg.srv.log === 1) {
                this.logRoutes();
            }
        });
    }

    start() {
        this.run();
    }

    stop() {
        this.event.emit('onStop', "ksmf", [this.web]);
        if (this.dao) {
            this.dao.disconnect();
        }
        if (this.web) {
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

        this.cfg.app.url = this.cfg.env.DATABASE_URL;
        this.cfg.app.logging = this.cfg.srv.log > 0;

        // ... configure Helper ...
        this.helper.configure({
            path: this.cfg.srv.module.path,
            src: this.cfg.srv.helper,
            name: 'helper'
        });

        // ... configure Events ...
        this.initEvents();
        this.event.emit('onInitConfig', "ksmf", [this.cfg]);
    }

    initEvents() {
        for (let event in this.cfg.srv.event) {
            const eventList = this.cfg.srv.event[event];
            for (let elm in eventList) {
                const subscriber = eventList[elm];
                this.event.add(this.helper.get(subscriber), event, "ksmf");
            }
        }
    }

    initApp() {
        this.event.emit('onInitApp', "ksmf", [this.web]);
        //... Set Error Handler
        this.web.use((err, req, res, next) => {
            this.event.emit('onError', "ksmf", [err, req, res, next]);
            this.setError(err, req, res, next);
        });

        this.web.use(compression());

        //... Allow all origin request, CORS on ExpressJS
        this.web.use(cors());

        //... Allow body Parser
        this.web.use(express.json());
        this.web.use(express.urlencoded());
        //this.web.use(express.multipart());

        //... Log requests 
        this.web.use((req, res, next) => {
            this.event.emit('onRequest', "ksmf", [req, res, next]);
            this.setLog(`>>> ${req.method} : ${req.path} `);
            return next();
        })
    }

    setLog(data) {
        const handler = this.helper.get('logger');
        if (handler && handler.log) {
            if (handler.configure) {
                handler.configure({
                    level: this.cfg.srv.log
                });
            }
            handler.log(data);
        }
    }

    setError(error, req = null, res = null, next = null) {
        const handler = this.helper.get('error');
        if (handler && handler.on) {
            handler.on(error, req, res, next);
        }
    }

    initModules() {
        this.event.emit('onInitModules', "ksmf", [this.cfg.srv.module.load]);
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
                    'helper': 'helper',
                    'dao': 'dao'
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
                if (obj && this.dao) {
                    this.event.emit('onLoadModule', "ksmf", [obj, name, this.cfg.srv.module.path + name + "/model/"]);
                }
            });
        }
    }

    initRoutes() {
        this.event.emit('onInitRoutes', "ksmf", [this.cfg.srv.route]);

        if (this.cfg.srv.route) {
            for (const i in this.cfg.srv.route) {
                const route = this.cfg.srv.route[i];
                if (this.web[route.method]) {
                    this.web[route.method](i, (req, res) => {
                        route.path = route.path || 'controller';
                        route.name = route.name || route.controller;
                        const controller = this.helper.get(route);
                        if (!controller || !controller[route.action]) {
                            this.setError(`Error << '${route.module}:${route.controller}:${route.action}'`, req, res);
                        }
                        controller[route.action](req, res);
                    });
                    this.event.emit('onLoadRoutes', "ksmf", [i, route, this.web]);
                }
            }
        }

        this.web.get('*', (req, res) => {
            this.event.emit('on404', "ksmf", [req, res]);
            this.setLog(`>>! ${req.method} : ${req.path} `);
            res.json({
                status: 'faild',
                data: "404"
            });
        });
    }

    logRoutes() {
        function print(path, layer) {
            if (layer.route) {
                layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
            } else if (layer.name === 'router' && layer.handle.stack) {
                layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
            } else if (layer.method) {
                console.log('%s /%s',
                    layer.method.toUpperCase(),
                    path.concat(split(layer.regexp)).filter(Boolean).join('/'))
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
    }
}

module.exports = AppWEB;