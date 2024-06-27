/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		21/05/2022
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
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
            data ? res.json(data) : res.status(400).end();
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:list",
                error: error.message || error,
                data: req.query
            });
            res.status(500).end();
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
            data ? res.json(data) : res.status(404).end();
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:select",
                error: error?.message || error,
                data: req.query
            });
            res.status(500).end();
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
            this.logger?.info({
                flow: req.flow,
                src: this.module + ":Controller:Data:insert",
                data
            });
            res.status(config?.action === "create" ? 201 : 200);
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:insert",
                error: error?.message || error,
                data: req.body
            });
            res.status(500).end();
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
            options.query = options.query || { id };
            options.query.id = id;
            const result = await this.srv.update({ data, attributes, ...options }, config);
            this.logger?.info({
                flow: req.flow,
                src: this.module + ":Controller:Data:update",
                data
            });
            if (!result || !result?.length) {
                return res.status(404).end();
            }
            res.status(config?.action === "create" ? 201 : 200);
            res.json(id && result?.length === 1 ? result[0] : result);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:update",
                error: error?.message || error,
                data: { id, body: data }
            });
            res.status(500).end();
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
        const params = this.srv?.extract(req.query);
        const keypid = this.srv?.getPKs()[0] || "id";
        const exclude = params?.attributes?.exclude || this.srv?.getAttrList({ key: 'exclude' }) || {};
        const target = {
            exclude,
            where: {
                [keypid]: req.params['id']
            }
        }
        params.data = req.body;
        params?.strict && (config.strict = params.strict);
        try {
            const data = await this.srv.clone(target, params, config);
            this.logger?.info({
                flow: req.flow,
                src: this.module + ":Controller:Data:clone",
                data
            });
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:clone",
                error: error.message || error,
                data: { params, target }
            });
            res.status(500).end();
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
            options.query = options.query || { id };
            options.query.id = id;
            const result = await this.srv.delete({ data, attributes, ...options }, config);
            this.logger?.info({
                flow: req.flow,
                src: this.module + ":Controller:Data:delete",
                data: result
            });
            if (!result) {
                return res.status(404).end();
            }
            res.json(id && result?.length === 1 ? result[0] : result);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:delete",
                error: error.message || error,
                data: { id, body: data }
            });
            res.status(500).end();
        }
    }
}

module.exports = DataController;