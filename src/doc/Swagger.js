/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/02/2022
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @require     swagger-ui-express swagger-jsdoc
 * @description swagger wrapper for creating API docs: https://swagger.io/specification/
 * */
class Swagger {

    /**
     * @description Initialize options on construct Swagger
     * @param {Object} opt 
     */
    constructor(opt) {
        this.cfg = {};
        this.exclude = opt && opt.exclude instanceof Array ? opt.exclude : [];
        this.definition = {};
    }

    /**
     * @description Set options on Initialize Configuration Event 
     * @param {Object} cfg 
     */
    onInitConfig(cfg) {
        this.cfg = cfg;
    }

    /**
     * @description load models for each module 
     * @param {Object} mod 
     * @returns 
     */
    onLoadModule(mod) {
        if (!this.exclude?.includes(mod.name)) {
            const docFileDescription = this.cfg.srv.module.path + mod.name + "/doc/index.js";
            if (require('fs').existsSync(docFileDescription)) {
                const definition = require(docFileDescription);
                this.mergeDeep(this.definition, definition);
            }
        }
    }

    /**
     * @description create all models associations
     * @param {Object} srv 
     */
    onInitCompleted(app) {
        if (!app?.web) {
            return null;
        }
        const path = require("path");
        const dir = path.resolve(app.path);
        const url = app.cfg.srv.doc.url;
        const definition = app.cfg.srv.doc.src ? app.loadConfig(path.join(app.path, app.cfg.srv.doc.src)) : null;
        definition.info = definition.info || {};
        definition.info.title = definition.info.title || app.cfg?.pack?.name;
        definition.info.version = definition.info.version || app.cfg?.pack?.version;
        definition.info.contact = definition.info.contact || app.cfg?.pack?.author?.email;
        definition.info.description = definition.info.description || app.cfg?.pack?.description;
        this.mergeDeep(this.definition, definition);
        if (!definition || !url) {
            return null;
        }
        const swaggerUI = require('swagger-ui-express');
        const swaggerJsDoc = require('swagger-jsdoc');
        app.web.use(
            url,
            swaggerUI.serve,
            swaggerUI.setup(swaggerJsDoc({
                definition: this.definition,
                apis: [
                    `${dir}/doc/**/*.yml`,
                    `${dir}/doc/**/*.json`,
                    `${dir}/doc/**/*.js`,
                    `${dir}/doc/**/*.ts`
                ]
            }), {
                explorer: true,
                customCssUrl: Array.isArray(definition.css) ? definition.css : [],
                customJs: Array.isArray(definition.js) ? definition.js : []
            })
        );
    }

    /**
     * @description Simple object check.
     * @param item
     * @returns {Boolean}
     */
    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    /**
     * @description Deep merge two objects.
     * @param target
     * @param ...sources
     */
    mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return this.mergeDeep(target, ...sources);
    }
}
module.exports = Swagger;