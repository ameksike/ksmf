/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        15/11/2021
 * @copyright   Copyright (c) 2020-2030
 * @license     GPL
 * @version     1.0
 **/
const _path = require('path');
const dotenv = require('dotenv');
const KsDp = require('ksdp');
const Config = require('./Config');
const Dir = require('./Dir');

class Project {

    /**
     * @type {import('ksdp').integration.IoC.cls.Async}
     */
    helper;

    /**
     * @type {import('ksdp').behavioral.Emitter}
     */
    event;

    /**
     * @type {Config}
     */
    config = null;

    /**
     * @type {Dir}
     */
    dir = null;

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
     * @param {Object} [option] 
     * @param {String} [option.path] project root path 
     * @param {Object} [option.cfg] configuration options 
     * @param {Object} [option.helper] driver to manage plugins  
     * @param {Object} [option.event]  driver to manage events 
     * @param {Object} [option.config] driver to manage configurations
     * @param {Object} [option.dir] driver to manage directories
     * @param {Array<any>} [option.mod] plugins/modules list 
     **/
    constructor(option = null) {
        this.mod = option?.mod || [];
        this.cfg = { srv: option?.cfg };
        this.path = _path.resolve(option?.path || '../../../../');
        this.helper = option?.helper || new KsDp.integration.IoC.cls.Async();
        this.event = option?.event || new KsDp.behavioral.Emitter();
        this.config = option?.config || new Config();
        this.dir = option?.dir || new Dir();
    }

    /**
     * @description register a plugin
     * @param {Object|String|Function|Array} plugin 
     * @param {Object} [option] 
     * @returns {App} self
     */
    async register(plugin, option = 'default') {
        if (!plugin || !this.helper) {
            return this;
        }
        await this.helper.set(plugin, option);
        plugin.helper = this.helper;
        plugin.init instanceof Function && plugin.init();
        return this;
    }

    /**
     * @description remove a plugin
     * @param {Object|String|Function|Array} plugin 
     * @param {Object} option 
     * @returns {App} self
     */
    async unregister(plugin = 'default', option = null) {
        if (!plugin || !this.helper) {
            return this;
        }
        await this.helper.del(plugin, option);
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
     * @return {App} self
     */
    subscribe(subscriber, event, option = null) {
        this.event?.subscribe(subscriber, event, option);
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
     * @return {App} self
     */
    unsubscribe(event, option = null, subscriber = null) {
        this.event?.unsubscribe(event, subscriber, option);
        return this;
    }

    /**
     * @description safely trigger events
     * @param {String} event 
     * @param {Array} params 
     * @param {String} scope 
     * @returns {App} self
     */
    emit(event, params = [], scope = 'ksmf') {
        try {
            this.event?.emit instanceof Function && this.event.emit(event, params);
        }
        catch (error) {
            this.logger?.error instanceof Function && this.logger.error({
                src: 'KsMf:Project:emit',
                error
            });
        }
        return this;
    }

    /**
     * @description initialize the application
     * @param {import('../types').TAppConfig} [options]
     * @returns {Promise<App>} self
     */
    init(options) {
        try {
            this.initLoad(options);
            this.initConfig(options);
        } catch (error) {
            this.emit('onError', [error, this]);
        }
        return Promise.resolve(this);
    }

    /**
     * @description preload configuration file, variables, environments, etc
     * @param {import('../types').TAppConfig} [options]
     */
    initLoad(options) {
        dotenv.config();
        const env = process.env || {};
        const eid = env["NODE_ENV"] || 'development';
        const loc = this.config.load('cfg/core.json', { dir: _path.resolve(__dirname, '../../'), id: eid });
        const srv = options?.config || this.cfg?.srv || this.config.load('cfg/core.json', { dir: this.path, id: eid });
        const pac = this.config.load(_path.join(this.path, 'package.json'));
        this.cfg.env = env;
        this.cfg.eid = eid;
        this.cfg.srv = { ...loc, ...srv };
        this.cfg.srv.helper = { ...loc.helper, ...srv?.helper };
        this.cfg.path = this.path;
        this.cfg.pack = pac;
    }

    /**
     * @description initialize configurations 
     * @param {import('../types').TAppConfig} [options]
     */
    initConfig(options) {
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
                on: (error) => this.emit('onError', [error, this])
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
    async initEvents() {
        for (let event in this.cfg.srv.event) {
            let eventList = this.cfg.srv.event[event];
            for (let elm in eventList) {
                let subscriber = eventList[elm];
                if (subscriber && this.event?.add instanceof Function) {
                    try {
                        let handler = await this.helper.get(subscriber);
                        handler && this.event.add(handler, event);
                    }
                    catch (error) {
                        this.logger?.error({
                            src: 'KsMf:Project:initEvents',
                            error
                        });
                    }
                }
            }
        }
        return this;
    }

    /**
     * @description load modules 
     */
    async initModules() {
        this.emit('onInitModules', [this.cfg.srv.module.load, this]);
        const modules = [];
        const mode = this.cfg?.srv?.module?.mode;
        if (this.cfg?.srv?.module?.load) {
            this.cfg.srv.module.load.forEach(item => this.initModule(item, modules));
        }
        if (mode === "auto" || mode === "dev") {
            const option = { watchRecursive: mode === "dev", readRecursive: false, onlyDir: true };
            const modDir = _path.resolve(this.cfg?.srv?.module?.path || _path.join(this.path, 'src'));
            await this.dir.on(modDir, async (item) => {
                if (item.name) {
                    try {
                        await this.initModule(item.name, modules);
                    }
                    catch (error) {
                        this.logger?.error({
                            src: 'KsMf:Project:initModule',
                            error
                        });
                    }
                }
            }, option);
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
    async initModule(item, modules) {
        const name = (typeof (item) === 'string') ? item : item.name;
        const opts = await this.initModuleOpts();
        const options = {
            // ... EXPRESS APP
            app: this,
            // ... extraoptions
            ...opts,
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
        let obj = await this.helper.get(item);
        if (!obj) {
            item.type = 'lib';
            obj = await this.helper.get(item);
        }
        if (obj) {
            modules?.push(obj);
            this.initModuleSetup(obj, item);
            this.emit('onLoadModule', [obj, name, _path.join(this.cfg.srv.module.path, name, "model"), this]);
        }
        return obj;
    }

    /**
     * @description initialize the module options 
     * @returns {Object}
     */
    initModuleOpts() {
        return {};
    }

    /**
     * @description initialize the module config
     * @param {Object} module 
     * @param {Object} option 
     * @returns {Object} module
     */
    initModuleSetup(module, option) {
        return module;
    }

    /**
     * @description start server 
     * @param {import('../types').TAppConfig} [options] 
     */
    async run(options = null) {
        this.emit('onStart', [options, this]);
    }
}

module.exports = Project;