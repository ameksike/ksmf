/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        21/05/2022
 * @copyright   Copyright (c) 2020-2030
 * @license     GPL
 * @version     1.0
 **/
const Controller = require('../app/Controller');

class DataController extends Controller {

    /**
     * @type {Object|null}
     */
    helper = null;

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @type {String}
     */
    srvName;

    /**
     * @type {String}
     */
    get modelAlias() {
        return this.srv?.modelName || this.module?.name || typeof this.module === "string" && this.module || this.srvName || "Data";
    }
    /**
     * @description configure action 
     * @param {Object} cfg 
     * @param {String} [cfg.modelName] 
     * @param {String} [cfg.srvName] 
     * @param {Object} [cfg.srv]
     * @returns {DataController} self
     */
    configure(cfg) {
        this.modelName = cfg?.modelName || this.modelName || "";
        this.srvName = cfg?.srvName || this.srvName || this.modelName || "";
        this.srv = cfg?.srv || this.srv || null;
        return this;
    }

    async init() {
        //... Define logger service as global for his controller
        this.logger = this.logger || this.helper?.get('logger');
        //... Define user service as global for his controller
        this.srv = typeof this.srv === "object" ?
            this.srv :
            (this.helper?.get(typeof this.srv === "string" ? this.srv : (this.srvName && {
                name: this.srvName,
                path: 'service',
                module: this.module,
                moduleType: this.module._?.type,
                dependency: {
                    dao: 'dao',
                    helper: 'helper'
                }
            })));
        this.initValidations();
    }

    /**
     * @description define groups of validations based on a certain action
     */
    initValidations() {
        // middlewares 
    }

    /**
     * @description get the DTO list
     * @param {Object} req 
     * @param {Object} res 
     * @example {{page?: Number; size?: Number; total?: Number; data?: Object[] }}
     */
    async list(req, res) {
        try {
            const format = req.query?.format && req.query.format !== 'exclude' ? req.query.format : 'basic';
            delete req.query.format;
            const flow = req.flow;
            const attributes = this.srv?.getAttrList({ key: format, defaults: 'basic' }) || {};
            const options = this.srv?.extract(req.query) || {};
            const data = await this.srv?.select({ flow, attributes, ...options });
            data ? res.json(data) : res.status(400).json({
                "error": "bad_request",
                "error_description": "The server could not understand the request due to invalid syntax or missing parameters."
            });
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":list",
                error: error.message || error,
                data: req.query
            });
            res.status(500).json({
                "error": "internal_server_error",
                "error_description": "The request was not processed correctly."
            });
        }
    }

    /**
     * @description get the DTO by id
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Promise<any>} DTO
     */
    async select(req, res) {
        try {
            const format = req.query.format || 'basic';
            delete req.query.format;
            const flow = req.flow;
            const attributes = this.srv?.getAttrList({ key: format, defaults: 'basic' }) || {};
            const options = this.srv?.extract(req.query) || {};
            options.query.id = req.params['id'];
            const data = await this.srv?.select({ limit: 1, flow, attributes, ...options });
            data ? res.json(data) : res.status(404).json({
                "error": "not_found",
                "error_description": "The target resource was not found."
            });
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":select",
                error: error?.message || error,
                data: req.query
            });
            res.status(500).json({
                "error": "internal_server_error",
                "error_description": "The request was not processed correctly."
            });
        }
    }

    /**
     * @description create new DTO
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Promise<any>} DTO
     */
    async insert(req, res) {
        const config = { flow: req.flow };
        const format = req.query?.format && req.query.format !== 'exclude' ? req.query.format : 'basic';
        delete req.query.format;
        try {
            const attributes = this.srv?.getAttrList({ key: format, defaults: 'basic' }) || {};
            const options = this.srv?.extract(req.query);
            const data = await this.srv.insert({ attributes, data: req.body, ...options }, config);
            if (config.error) {
                throw config.error;
            }
            this.logger?.info({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":insert",
                data
            });
            res.status(config?.action === "create" ? 201 : 200);
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":insert",
                error: error?.message || error,
                data: req.body
            });
            res.status(500).json({
                "error": "internal_server_error",
                "error_description": "The request was not processed correctly."
            });
        }
    }

    /**
     * @description update user by id
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Promise<any>} DTO
     */
    async update(req, res) {
        const config = { flow: req.flow };
        const data = req.body;
        const id = req.params.id || data.id;
        const format = req.query?.format && req.query.format !== 'exclude' ? req.query.format : 'basic';
        delete req.query.format;
        try {
            const attributes = this.srv?.getAttrList({ key: format, defaults: 'basic' }) || {};
            const options = this.srv?.extract(req.query);
            if (!id && !Object.keys(options.where || {}).length && !Object.keys(options.query || {}).length) {
                return res.status(400).json({
                    "error": "bad_request",
                    "error_description": "The server could not understand the request due to invalid syntax or missing parameters."
                });
            }
            if (id) {
                options.query = options.query || { id };
                options.query.id = id;
            }
            const tmp = await this.srv.update({ data, attributes, ...options }, config);
            this.logger?.info({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":update",
                data
            });
            const result = tmp?.data || tmp;
            if (!result || (Array.isArray(result) && !result?.length)) {
                return res.status(404).json({
                    "error": "not_found",
                    "error_description": "The target resource was not found."
                });
            }
            res.status(config?.action === "create" ? 201 : 200);
            if (tmp.total && result?.length === 1 && result[0].affectedRows) {
                tmp.total = result[0].affectedRows;
            }
            res.json(id && result?.length === 1 ? result[0] : tmp);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":update",
                error: error?.message || error,
                data: { id, body: data }
            });
            res.status(500).json({
                "error": "internal_server_error",
                "error_description": "The request was not processed correctly."
            });
        }
    }

    /**
     * @description update user by id
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Promise<any>} DTO
     */
    async clone(req, res) {
        const config = { flow: req.flow };
        const params = this.srv?.extract(req.query, {
            clean: true,
            key: {
                strict: 'Boolean'
            }
        });
        const keypid = this.srv?.getPKs()[0] || "id";
        const exclude = params?.attributes?.exclude || this.srv?.getAttrList({ key: 'exclude', defaults: null }) || {};
        const target = {
            exclude,
            where: {
                [keypid]: req.params['id']
            }
        }
        params.data = req.body;
        params?.query?.strict && (config.strict = params?.query?.strict);
        try {
            const data = await this.srv.clone(target, params, config);
            this.logger?.info({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":clone",
                data
            });
            data ? res.json(data) : res.status(404).json({
                "error": "not_found",
                "error_description": "The target resource was not found."
            });
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":clone",
                error: error.message || error,
                data: { params, target }
            });
            res.status(500).json({
                "error": "internal_server_error",
                "error_description": "The request was not processed correctly."
            });
        }
    }

    /**
     * @description delete user by id
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Promise<any>} DTO
     */
    async delete(req, res) {
        const config = { flow: req.flow };
        const data = req.body;
        const id = req.params.id || data.id;
        const format = req.query?.format && req.query.format !== 'exclude' ? req.query.format : 'basic';
        delete req.query.format;
        try {
            const attributes = this.srv?.getAttrList({ key: format, defaults: 'basic' }) || {};
            const options = this.srv?.extract(req.query);
            options.query = options.query || {};
            id && (options.query.id = id);
            if (!options?.where && !id) {
                return res.status(400).json({
                    "error": "bad_request",
                    "error_description": "The server could not understand the request due to invalid syntax or missing parameters."
                });
            }
            const result = await this.srv.delete({ data, attributes, ...options }, config);
            this.logger?.info({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":delete",
                data: result
            });
            if (!result) {
                return res.status(404).json({
                    "error": "not_found",
                    "error_description": "The target resource was not found."
                });
            }
            res.json(id && result?.length === 1 ? result[0] : result);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "Controller:" + this.modelAlias + ":delete",
                error: error.message || error,
                data: { id, body: data }
            });
            res.status(500).json({
                "error": "internal_server_error",
                "error_description": "The request was not processed correctly."
            });
        }
    }

    /**
     * @description Bulk delete by id
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Promise<any>} DTO
     */
    clean(req, res) {
        let ids = req.body.ids || req.body;
        req.query = req.query || {};
        if (Array.isArray(ids)) {
            let pks = this.srv?.getFieldId();
            pks && (req.query.where = {
                [pks]: { [this.srv?.dao?.manager?.Op?.in]: ids }
            });
        }
        return this.delete(req, res);
    }
}

module.exports = DataController;