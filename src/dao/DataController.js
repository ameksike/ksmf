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

    constructor() {
        super(...arguments);
        this.srvName = 'UserService';
    }

    /**
     * @description configure action 
     * @param {Object} cfg 
     * @param {String} cfg.modelName
     * @param {Object} cfg.srv
     * @returns {Object} this
     */
    configure(cfg) {
        this.modelName = cfg?.modelName || this.modelName || "";
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
     * @returns { page: Number, size: Number, total: Number, data: [DTO] }
     */
    async list(req, res) {
        const query = this.srv?.extract(req.query);
        try {
            const data = await this.srv.select(query);
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Default:list",
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
     * @returns {Object} DTO
     */
    async select(req, res) {
        const params = this.srv?.extract(req.query);
        params.query.id = req.params['id'];
        try {
            const data = await this.srv.select(params);
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Default:select",
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
     * @returns {Object} DTO
     */
    async insert(req, res) {
        const payload = req.body;
        try {
            const data = await this.srv.insert({ data: payload });
            this.logger?.info({
                flow: req.flow,
                src: this.module + ":Controller:Default:insert",
                data
            });
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Default:insert",
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
     * @returns {Object} DTO
     */
    async update(req, res) {
        const params = this.srv?.extract(req.query);
        params.query.id = req.body.id || req.params['id'];
        params.data = req.body;
        try {
            const data = await this.srv.update(params);
            this.logger?.info({
                flow: req.flow,
                src: this.module + ":Controller:Default:update",
                data
            });
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Default:update",
                error: error.message || error,
                data: params
            });
            res.status(500).end();
        }
    }

    /**
     * @description delete user by id
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Object} DTO
     */
    async delete(req, res) {
        const params = this.srv?.extract(req.query);
        params.query.id = req.body.id || req.params['id'];
        try {
            const data = await this.srv.delete(params);
            this.logger?.info({
                flow: req.flow,
                src: this.module + ":Controller:Default:delete",
                data
            });
            res.json(data);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: this.module + ":Controller:Default:delete",
                error: error.message || error,
                data: params
            });
            res.status(500).end();
        }
    }
}

module.exports = DataController;