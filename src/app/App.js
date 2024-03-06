/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		15/11/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
const dotenv = require('dotenv');
const KsDp = require('ksdp');
const Config = require('./Config');
const _path = require('path');

class App {

    /**
     * @type {KsDp.integration.IoC|null}
     */
    helper = null;

    /**
     * @type {KsDp.behavioral.Observer|null}
     */
    event = null;

    /**
     * @type {Config|null}
     */
    config = null;

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @type {Array}
     */
    mod;

    /**
     * @type {Object}
     */
    cfg;

    /**
     * @description initialize library
     * @param {String} [path] 
     **/
    constructor(path = null) {
        this.mod = [];
        this.cfg = {};
        this.path = path || _path.resolve('../../../../');
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
        if (!plugin || !this.helper) {
            return this;
        }
        this.helper.set(plugin, option);
        plugin.helper = this.helper;
        plugin.init instanceof Function && plugin.init();
        return this;
    }

    /**
     * @description remove a plugin
     * @param {Object|String|Function|Array} plugin 
     * @param {Object} option 
     * @returns {AppWEB} self
     */
    unregister(plugin = 'default', option = null) {
        if (!plugin || !this.helper) {
            return this;
        }
        this.helper.del(plugin, option);
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
     * @description preload configuration file, variables, environments, etc
     * @param {import('../types').TAppConfig} [options]
     */
    init(options) {
        try {
            this.initConfig(options);
        } catch (error) {
            this.emit('onError', [error, this]);
        }
        return this;
    }

    /**
     * @description preload configuration file, variables, environments, etc
     * @param {import('../types').TAppConfig} [options]
     */
    initConfig(options) {
        dotenv.config();
        const env = process.env || {};
        const eid = env["NODE_ENV"] || 'development';
        const srv = options?.config || this.config.load('cfg/core.json', { dir: this.path, id: eid });
        const pac = this.config.load(_path.join(this.path, 'package.json'));

        this.cfg.env = env;
        this.cfg.eid = eid;
        this.cfg.srv = srv;
        this.cfg.path = this.path;
        this.cfg.pack = pac;

        this.cfg.srv.module = this.cfg.srv.module || {};
        this.cfg.srv.module.path = _path.join(this.path, 'src/');
        this.cfg.srv.log = this.cfg.env.LOG_LEVEL ? this.cfg.env.LOG_LEVEL : this.cfg.srv.log;
        this.cfg.srv.event = this.cfg.srv.event || {};
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
        this.emit('onInitConfig', [this.cfg, this]);
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
     * @description initialize a module
     * @param {import('../types').TOption|String} item 
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
                    'prj': _path.resolve(this.path),
                    'mod': _path.join(this.cfg.srv.module.path, name),
                    'app': _path.join(this.cfg.srv.module.path, "app")
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
            this.emit('onLoadModule', [obj, name, _path.join(this.cfg.srv.module.path, name, "model"), this]);
        }
        return obj;
    }

    /**
     * @description start server 
     * @param {import('../types').TAppConfig} [options] 
     */
    async run(options = null) {
        this.emit('onStart', [options, this]);
    }
}

module.exports = App;