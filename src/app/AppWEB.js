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
    }

    init() {
        try {
            this.initConfig();
            this.initApp();
            this.initModels();
            this.initModules();
            this.initRoutes();
        } catch (error) {
            this.setError(error);
        }
        return this;
    }

    run() {
        return this.web.listen(this.cfg.srv.port, () => {
            this.setLog(`>>> SERVER: ${this.cfg.srv.protocol}://${this.cfg.srv.host}:${this.cfg.srv.port}`);
            if (this.cfg.srv.log === 1) {
                this.logRoutes();
            }
        });
    }

    stop() {
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

        this.cfg.srv.module = this.cfg.srv.module || {};
        this.cfg.srv.module.path = this.path + 'src/';
        this.cfg.srv.log = this.cfg.env.LOGGER_DB === 'true' ? 1 : this.cfg.srv.log;
        this.cfg.srv.port = this.cfg.env.PORT || this.cfg.srv.port;

        this.cfg.app.url = this.cfg.env.DATABASE_URL;
        this.cfg.app.logging = this.cfg.srv.log > 0;
        this.helper.configure({
            path: this.cfg.srv.module.path,
            src: this.cfg.srv.helper,
            name: 'helper'
        });
    }

    initApp() {
        //... Set Error Handler
        this.web.use((err, req, res, next) => {
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

    initModels() {
        this.dao = this.helper.get('dao');
        if (this.dao) {
            this.dao.configure(this.cfg.app);
            this.dao.connect();
            this.dao.load(this.path + 'db/models/');
        }
    }

    initModules() {
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
                    this.dao.load(this.cfg.srv.module.path + name + "/model/");
                }
            });
        }
    }

    initRoutes() {
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
                }
            }
        }

        this.web.get('*', (req, res) => {
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

        this.web._router.stack.forEach(print.bind(null, []))
    }
}

module.exports = AppWEB;