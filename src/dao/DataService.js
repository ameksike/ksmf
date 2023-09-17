const ksdp = require("ksdp");
const kscrip = require("kscryp");
const Utl = require("../app/Utl");
class DataService extends ksdp.integration.Dip {

    constructor(cfg) {
        super();
        this.utl = new Utl();
        this.configure(cfg);
    }

    /**
     * 
     * @param {Object} cfg 
     * @param {String} cfg.modelName
     * @param {String} cfg.modelKey
     * @param {String} cfg.modelKeyStr
     * @param {Object} cfg.modelInclude
     * @param {String} cfg.modelStatus
     * @param {Object} cfg.constant
     * @param {Object} cfg.dao  { models: Object, driver: Object, manager: Object}
     * @param {Object} cfg.logger 
     */
    configure(cfg) {
        this.modelName = cfg?.modelName || this.modelName || "";
        this.modelKey = cfg?.modelKey || this.modelKey || "";
        this.modelKeyStr = cfg?.modelKeyStr || this.modelKeyStr || "";
        this.modelInclude = cfg?.modelInclude || this.modelInclude || null;
        this.modelStatus = cfg?.modelStatus || this.modelStatus || null;
        this.dao = cfg?.dao || this.dao || {};
        this.logger = cfg?.logger || this.logger || null;
        this.utl = cfg?.utl || this.utl || null;
        this.constant = cfg?.constant || this.constant || {
            action: {
                none: 0,
                read: 1,
                update: 2,
                create: 3,
                write: 4,
                all: 5
            },
            quantity: {
                all: "all",
                one: "one"
            },
            status: {
                disabled: 0,
                activated: 1,
                blocked: 3
            }
        };
    }

    /**
     * @description get paginator options
     * @param {Object} payload 
     * @param {Object} options 
     * @returns {Object}
     */
    getPaginator(payload, options) {
        let { page, size, limit, jump } = payload;
        page = parseInt(page) || 1;
        jump = page > 0 ? page - 1 : 0;
        size = parseInt(limit) || parseInt(size) || 10;
        return {
            page,
            size,
            offset: jump * size,
            limit: size
        }
    }

    /**
     * @description format the where clause
     * @param {Object} payload 
     * @param {Object} options 
     * @returns {Object}
     */
    getWhere({ where, query }, options) {
        let subFilter = {};
        if (typeof query === "number" || !isNaN(query)) {
            subFilter[this.getPK()] = parseInt(query);
        } else if (typeof query === "string" && this.modelKeyStr && this.hasAttr(this.modelKeyStr)) {
            subFilter[this.modelKeyStr] = query;
        }
        let subWhere = this.getAttrs(where);
        let subQuery = this.getAttrs(query);
        return { ...subWhere, ...subQuery, ...subFilter };
    }

    /**
     * @description format the include clause
     * @param {Object} payload 
     * @param {Object} options 
     * @returns {Object} include
     */
    getInclude({ include }, options) {
        return include || this.modelInclude;
    }

    /**
     * @description format the filters on count
     * @param {Object} payload 
     * @param {Object} options 
     * @returns {Object}
     */
    getCountFilter(payload, options) {
        const where = this.getWhere(payload, options);
        const include = this.getInclude(payload, options);
        return { include, where, distinct: true };
    }

    /**
     * @description get if it is single or multiple selection 
     * @param {Object} payload 
     * @param {Object} opt 
     * @returns {Boolean}
     */
    iSingle(payload, opt) {
        const pk = this.getPK();
        const map = payload?.where || [];
        if (map[pk] || map[this.modelKeyStr]) {
            return true;
        }
        payload.quantity = payload?.quantity?.toLocaleLowerCase() || this.constant?.quantity?.all;
        payload.quantity = payload?.limit === 1 ? this.constant?.quantity?.one : payload.quantity;
        return Boolean(payload.quantity === this.constant?.quantity?.one);
    }

    /**
     * @description overload action for findAll/findOne
     * @param {Object} payload
     * @param {Object|String|Number} payload.query 
     * @param {String} payload.quantity 
     * @param {Array} payload.attributes 
     * @returns {Object} row
     */
    async select(payload, opt) {
        try {
            payload.tmp = {};

            const model = this.getModel();
            const paginator = this.getPaginator(payload, opt);
            const include = this.getInclude(payload, opt);
            const where = this.getWhere(payload, opt) || {};
            const iSingle = this.iSingle({ ...payload, where }, opt);
            const action = iSingle ? "findOne" : "findAll";
            const whereCount = iSingle ? {} : this.getCountFilter(payload, opt);

            if (!model) {
                return null;
            }
            if (this.modelStatus && (payload.valid === undefined || payload.valid)) {
                where[this.modelStatus] = 1;
                whereCount.where = whereCount.where || {};
                whereCount.where[this.modelStatus] = 1;
            }

            const cfg = {
                attributes: payload?.attributes,
                offset: paginator.offset,
                limit: paginator.limit,
                where,
                include
            };
            payload.order && (cfg.order = payload.order);

            const [data, total] = await Promise.all([
                model[action](cfg),
                iSingle ? Promise.resolve(1) : model["count"](whereCount)
            ]);

            return !iSingle ? {
                page: paginator.page,
                size: paginator.size,
                total,
                data
            } : data;
        }
        catch (error) {
            const logger = this.getLogger();
            logger?.error({
                flow: opt?.flow,
                src: "Service:" + this.modelName + ":Select",
                data: payload,
                error: { message: error?.message || error, stack: error?.stack },
            });
            return null;
        }
    }

    /**
     * @description format request payload before perform the query
     * @param {Object} data
     * @param {String} action
     * @param {Object} options
     * @param {Object} row
     * @returns {Object}
     */
    getRequest(data, action, options, row) {
        return this.getAttrs(data);
    }

    /**
     * @description format the result of the query
     * @param {Object} data
     * @param {String} action
     * @param {Object} options
     * @returns {Object}
     */
    getResponse(data, action, options) {
        return data;
    }

    /**
     * @description get the object model
     * @returns {Object}
     */
    getModel(name = null) {
        return this.dao?.models[name || this.modelName];
    }

    getDriver() {
        this.driver = this.dao?.driver;
        return this.driver;
    }

    getManager() {
        this.manager = this.dao?.manager;
        return this.manager;
    }

    /**
     * @description get attributes map
     * @param {Object} lst 
     * @param {Number} mode 
     * @returns {Object} attributes
     */
    getAttrs(lst, mode = 0) {
        const model = this.getModel();
        if (!model || (!lst && !mode)) return {};
        if (!lst) {
            return mode === 2 ? model?.tableAttributes : Object.keys(model?.tableAttributes || {});
        }
        let tmp = {};
        for (let i in lst) {
            if (model.tableAttributes[i] && lst[i] !== undefined) {
                tmp[i] = lst[i];
            }
        }
        return tmp;
    }

    /**
     * @description verify an attribute from the model
     * @param {String} key 
     * @param {Object} map 
     * @returns {Object} Attribute or null
     */
    hasAttr(key, map) {
        map = map || this.getAttrs(null, 2);
        return map && key && map[key];
    }

    /**
     * @description get the primary key 
     * @returns {String}
     */
    getPK() {
        // TODO: allow composite keys
        const model = this.getModel();
        return this.modelKey || Object.keys(model?.primaryKeys || {})[0];
    }

    /**
     * @description get the table name
     * @returns  {String}
     */
    getTableName() {
        const model = this.getModel();
        return model.tableName;
    }

    /**
     * @description read/update/create 
     * @param {Object} payload 
     * @param {Object} payload.data 
     * @param {Object} payload.where 
     * @param {Object} payload.row 
     * @param {Number} payload.mode 
     * @param {Boolean} payload.error 
     * @param {Object} payload.transaction 
     * @returns {Object} row
     */
    async save(payload, opt) {
        let { data, row, mode = this.constant?.action?.read, transaction = null, error = false } = payload || {};
        opt = opt || {};
        try {
            payload.flow = payload.flow || opt?.flow;
            payload.tmp = {};
            opt.action = opt.action || "select";

            const model = this.getModel();
            const where = this.getWhere(payload, opt);
            if (!row && this.utl?.asBoolean(where) && !Array.isArray(data)) {
                row = await model.findOne({ where }, { transaction });
            }

            if (mode <= this.constant?.action?.read) {
                return row;
            }

            const modelKey = this.getPK();
            const options = {};

            if (transaction) {
                options.transaction = transaction;
            }

            if (!error && mode === this.constant?.action?.create) {
                options.ignoreDuplicates = true;
            }

            if (!error && (mode >= this.constant?.action?.write || mode === this.constant?.action?.update)) {
                options.updateOnDuplicate = Array.isArray(modelKey) ? modelKey : [modelKey];
            }

            if (!row && (mode >= this.constant?.action?.write || mode === this.constant?.action?.create)) {
                opt.action = "create";
                let res = model[Array.isArray(data) ? "bulkCreate" : opt.action](this.getRequest(data, opt.action, payload), options);
                return this.getResponse(await res, opt.action, payload);
            }

            if (row && (mode >= this.constant?.action?.write || mode === this.constant?.action?.update) && this.utl?.isDifferent(row, data)) {
                opt.action = "update";
                let res = Array.isArray(data) ?
                    model.bulkCreate(this.getRequest(data, opt.action, payload, row), options) :
                    row.update(this.getRequest(data, opt.action, payload, row), options);
                return this.getResponse(await res, opt.action, payload);
            }

            return this.getResponse(row, opt.action, payload);
        } catch (error) {
            const logger = this.getLogger();
            logger?.error({
                flow: opt?.flow,
                src: "Service:" + this.modelName + ":Save",
                data,
                error: { message: error?.message || error, stack: error?.stack },
            });
            if (transaction) {
                await transaction.rollback();
            }
            opt.error = error;
            return null;
        }
    }

    /**
     * @description perform a raw query 
     * @param {Object} payload 
     * @param {String} payload.sql
     * @param {Object} payload.params 
     * @param {Object} payload.options 
     * @param {String} payload.src 
     * @param {String} payload.flow 
     * @returns {Array|undefined} result 
     */
    async query(payload = {}) {
        try {
            const driver = this.getDriver();
            let sql = payload.sql.replace(/:table/ig, this.getTableName());
            let params = payload.params || {};
            let options = {
                replacements: params
            };
            if (/^[\n|\r|\s]*SELECT/ig.test(sql)) {
                options.type = driver.QueryTypes.SELECT
            }
            return await driver.query(sql, payload.options || options);
        }
        catch (error) {
            payload.error = error;
            const logger = this.getLogger();
            logger?.error({
                flow: payload.flow,
                data: payload.params,
                src: "Service:" + this.modelName + ":" + (payload.src || "Query"),
                error: { message: error?.message || error, stack: error?.stack, sql: payload.sql },
            });
            return null;
        }
    }

    /**
     * @description read/update/create 
     * @param {Object} payload 
     * @param {Object} payload.data 
     * @param {Object} payload.where 
     * @param {Object} payload.row 
     * @param {Number} payload.mode 
     * @param {Object} payload.transaction 
     * @returns {Object} row
     */
    async delete(payload, opt) {
        const model = this.getModel();
        if (!model.destroy) {
            return null;
        }
        try {
            const row = await this.select(payload, opt);
            return row && await row.destroy();
        } catch (error) {
            const logger = this.getLogger();
            logger?.error({
                flow: opt?.flow,
                src: "Service:" + this.modelName + ":Delete",
                data: payload,
                error: { message: error?.message || error, stack: error?.stack },
            });
            return null;
        }
    }

    /**
     * @description insert an entity
     * @param {Object} payload 
     * @param {Object} payload.data 
     * @param {Object} payload.where 
     * @param {Object} payload.row 
     * @param {Number} payload.mode 
     * @param {Object} payload.transaction 
     * @returns {Object} row
     */
    create(payload, opt) {
        return this.insert(payload, opt);
    }

    /**
     * @description insert an entity
     * @param {Object} payload 
     * @param {Object} payload.data 
     * @param {Object} payload.where 
     * @param {Object} payload.row 
     * @param {Number} payload.mode 
     * @param {Object} payload.transaction 
     * @returns {Object} row
     */
    insert(payload, opt) {
        payload.mode = this.constant?.action?.create;
        return this.save(payload, opt);
    }

    /**
     * @description update an entity
     * @param {Object} payload 
     * @param {Object} payload.data 
     * @param {Object} payload.where 
     * @param {Object} payload.row 
     * @param {Number} payload.mode 
     * @param {Object} payload.transaction 
     * @returns {Object} row
     */
    update(payload, opt) {
        payload.mode = this.constant?.action?.update;
        return this.save(payload, opt);
    }

    /**
     * @description get count of data from model
     * @param {OBJECT} options 
     * @param {STRING} options.col specify the column on which you want to call the count() method with the col
     * @param {BOOLEAN} options.distinct tell Sequelize to generate and execute a COUNT( DISTINCT( lastName ) ) query 
     * @returns {NUMBER}
     */
    async count(options = {}) {
        if (!this.dao) return null;
        try {
            const model = this.getModel();
            return await model.count(options);
        } catch (error) {
            const logger = this.getLogger();
            if (logger) {
                logger.prefix('CRUD.Service').error(error);
            }
            return null;
        }
    }

    /**
     * @description get filters as query 
     *              see: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
     * @param {ARRAY} filter 
     */
    asQuery(filter) {
        filter = kscrip.decode(filter, "json");
        if (!filter) return {};
        const Sequelize = this.getManager();
        const model = this.getModel();
        const where = {};
        for (let i in filter) {
            let [field, value, operator = 'eq'] = filter[i];
            if (model?.tableAttributes?.hasOwnProperty(field)) {
                value = ['like', 'ilike'].includes((operator || '').toLowerCase()) ? '%' + value + '%' : value;
                if (Sequelize.Op[operator]) {
                    where[field] = {
                        [Sequelize.Op[operator]]: value
                    }
                }
            }
        }
        return where;
    }

    /**
     * @description get sort obtion as order format
     *              see: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering-and-grouping
     * @param {Array} sort 
     * @returns {Array} order options
     */
    asOrder(sort) {
        const list = kscrip.decode(sort, "json");
        if (!list) return [];
        const model = this.getModel();
        return list?.filter && list.filter(item => item && item[0] && model.tableAttributes.hasOwnProperty(item[0]));
    }

    /**
     * @description Get Logger Object
     * @returns {Object} Logger
     */
    getLogger() {
        if (this.logger) {
            return this.logger;
        }

        if (this.helper) {
            return this.helper.get('logger');
        }
    }

    /**
     * @description Extract hotkeys from request parameters 
     * @param {Object} req 
     * @returns { page: Number, size: Number, filter: Object, query: Object, order:Array }
     */
    extract(req) {
        const res = {};
        if (req.page) {
            res.page = req.page;
            delete req["page"];
        }
        if (req.size) {
            res.size = req.size;
            delete req["size"];
        }
        if (req.filter) {
            res.where = this.asQuery(req.filter);
            delete req["filter"];
        }
        if (req.order) {
            res.order = this.asOrder(req.order);
            delete req["order"];
        }
        if (req.limit) {
            res.limit = parseInt(req.limit);
            delete req["limit"];
        }
        res.query = { ...req };
        return res;
    }
}

module.exports = DataService;