/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        21/05/2022
 * @copyright   Copyright (c) 2020-2030
 * @license     GPL
 * @version     1.0
 **/
const Controller = require('../plugin/Controller');

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
        this.logger = this.helper.get('logger');
        //... Define user service as global for his controller
        this.srv = typeof this.srv === "object" ?
            this.srv :
            (this.helper.get(typeof this.srv === "string" ? this.srv : {
                name: this.srvName,
                path: 'service',
                module: this.module,
                moduleType: this.module._?.type,
                dependency: {
                    dao: 'dao',
                    helper: 'helper'
                }
            }));
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
        const query = this.srv?.extract(req.query);
        try {
            query.flow = req.flow;
            const data = await this.srv.select(query);
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:list",
                error: error.message || error,
                data: query
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
        const params = this.srv?.extract(req.query);
        params.query.id = req.params['id'];
        params.flow = req.flow;
        try {
            const data = await this.srv.select(params);
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:select",
                error: error.message || error,
                data: params
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
        const payload = req.body;
        try {
            const data = await this.srv.insert({ data: payload }, config);
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
                error: error.message || error,
                data: payload
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
        const params = this.srv?.extract(req.query);
        params.query.id = req.body.id || req.params['id'];
        params.data = req.body;
        try {
            const data = await this.srv.update(params, config);
            this.logger?.info({
                flow: req.flow,
                src: this.module + ":Controller:Data:update",
                data
            });
            res.status(config?.action === "create" ? 201 : 200);
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:update",
                error: error.message || error,
                data: params
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
        const keypid = this.srv.getPKs()[0] || "id";
        const target = {
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
        const params = this.srv?.extract(req.query);
        params.query.id = req.body.id || req.params['id'];
        try {
            const data = await this.srv.delete(params, config);
            this.logger?.info({
                flow: req.flow,
                src: this.module + ":Controller:Data:delete",
                data
            });
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Data:delete",
                error: error.message || error,
                data: params
            });
            res.status(500).end();
        }
    }
}

module.exports = DataController;