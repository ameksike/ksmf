/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        21/05/2022
 * @copyright   Copyright (c) 2020-2030
 * @license     GPL
 * @version     1.0
 **/

const ksdp = require("ksdp");
const kscrip = require("kscryp");
const Utl = require("../common/Utl");

class DataService extends ksdp.integration.Dip {

    /**
     * @type {Object|null}
     */
    helper = null;

    /**
     * @type {Console|null}
     */
    logger = null;

    constructor(cfg) {
        super();
        this.utl = new Utl();
        this.configure(cfg);
    }

    /**
     * @description configure action 
     * @param {Object} cfg 
     * @param {String} [cfg.modelName]
     * @param {String} [cfg.modelKey]
     * @param {Array} [cfg.modelKeys]
     * @param {String} [cfg.modelKeyStr]
     * @param {Object} [cfg.modelInclude]
     * @param {String} [cfg.modelStatus]
     * @param {Array} [cfg.updateOnDuplicate]
     * @param {Object} [cfg.constant]
     * @param {Object} [cfg.utl]
     * @param {{ models?: Object; driver?: Object; manager?: Object}} [cfg.dao]
     * @param {Object} [cfg.logger] 
     * @returns {DataService} self
     */
    configure(cfg) {
        this.modelName = cfg?.modelName || this.modelName || "";
        this.modelKey = cfg?.modelKey || this.modelKey || "";
        this.modelKeys = cfg?.modelKeys || this.modelKeys || null;
        this.modelKeyStr = cfg?.modelKeyStr || this.modelKeyStr || "";
        this.modelInclude = cfg?.modelInclude || this.modelInclude || null;
        this.modelStatus = cfg?.modelStatus || this.modelStatus || null;
        this.updateOnDuplicate = cfg?.updateOnDuplicate || this.updateOnDuplicate || null;
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
        return this;
    }

    /**
     * @description get paginator options
     * @param {Object} payload 
     * @param {Object} [options] 
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
     * @param {Object} [options] 
     * @returns {Object}
     */
    getWhere({ where, query }, options) {
        let subFilter = {};
        if (typeof query === "number" || !isNaN(query)) {
            let pks = this.modelKey || this.getPKs()[0] || "id"; // TODO: check this PK selection
            subFilter[pks] = parseInt(query);
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
     * @param {Object} [payload.where]
     * @param {Boolean} [payload.auto] 
     * @param {Number} [payload.limit] 
     * @param {String} [payload.quantity] 
     * @param {Object} opt 
     * @returns {Boolean}
     */
    iSingle(payload, opt) {
        const map = payload?.where || {};
        if (payload.auto || payload.auto === undefined) {
            const pks = this.getPKs();
            const con = this.utl.contains(pks, Object.keys(map));
            if (con.length === pks.length || map[this.modelKeyStr]) {
                return true;
            }
        }
        payload.quantity = payload?.quantity?.toLocaleLowerCase() || this.constant?.quantity?.all;
        payload.quantity = payload?.limit === 1 ? this.constant?.quantity?.one : payload.quantity;
        return Boolean(payload.quantity === this.constant?.quantity?.one);
    }

    /**
     * @description overload action for findAll/findOne
     * @param {Object} payload
     * @param {Object|String|Number} [payload.query] 
     * @param {Array} [payload.attributes] 
     * @param {Object} [payload.include] 
     * @param {Object} [payload.where] 
     * @param {String} [payload.quantity] 
     * @param {Number} [payload.limit]
     * @param {Number} [payload.page]
     * @param {Number} [payload.size]
     * @param {String} [payload.order] 
     * @param {Number} [payload.jump]
     * @param {Boolean} [payload.auto] 
     * @param {Boolean} [payload.valid]
     * @param {Object} [payload.tmp]
     * @returns {Promise<any>} row
     */
    async select(payload, opt) {
        try {
            opt = opt || {};
            payload = payload || {};
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
                src: "KsMf:DAO:" + this.modelName + ":Select",
                data: payload,
                error: { message: error?.message || error, stack: error?.stack },
            });
            return null;
        }
    }

    /**
     * @description format request payload before perform the query
     * @param {Object} data
     * @param {String} [action]
     * @param {Object} [options]
     * @param {Object} [row]
     * @returns {Object}
     */
    getRequest(data, action, options, row) {
        return this.getAttrs(data);
    }

    /**
     * @description format the result of the query
     * @param {Object} data
     * @param {String} [action]
     * @param {Object} [options]
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
     * @param {Object|Array} lst 
     * @param {Number} [mode] 
     * @returns {Object} attributes
     */
    getAttrs(lst, mode = 0) {
        if (Array.isArray(lst)) {
            let tmp = [];
            for (let i in lst) {
                tmp[i] = this.getAttrs(lst[i], mode);
            }
            return tmp;
        }
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
     * @returns {Array<string>}
     */
    getPKs() {
        const model = this.getModel();
        return (Array.isArray(this.modelKeys) && this.modelKeys) ||
            Object.keys(model?.primaryKeys || {}) ||
            [this.modelKey];
    }

    /**
     * @description get the table name
     * @returns  {String}
     */
    getTableName(name = null) {
        const model = this.getModel(name);
        return model.tableName;
    }

    /**
     * @description read/update/create 
     * @param {Object} payload 
     * @param {Object} [payload.data] 
     * @param {Object} [payload.where] 
     * @param {Object} [payload.row] 
     * @param {Number} [payload.mode] 
     * @param {Boolean} [payload.strict] 
     * @param {Boolean} [payload.error] 
     * @param {Object} [payload.tmp] 
     * @param {String} [payload.flow] 
     * @param {Array} [payload.updateOnDuplicate] 
     * @param {Object} [payload.transaction] 
     * @param {Object} [opt] 
     * @param {String} [opt.action] 
     * @param {String} [opt.flow] 
     * @param {Object} [opt.error] 
     * @param {Boolean} [opt.reload] 
     * @returns {Promise<any>} row 
     */
    async save(payload, opt) {
        let { data, row, mode = this.constant?.action?.read, transaction = null, error = false, strict = false } = payload || {};
        opt = opt || {};
        try {
            payload.flow = payload.flow || opt?.flow;
            payload.tmp = {};
            opt.action = opt.action || "select";
            const model = this.getModel();
            const where = this.getWhere(payload, opt);
            if (!row && this.utl?.asBoolean(where) && !Array.isArray(data)) {
                row = await this.select({ ...payload, limit: 1 }, opt);
            }
            if (mode < this.constant?.action?.read) {
                return null;
            }
            if (mode === this.constant?.action?.read || row && mode === this.constant?.action?.create) {
                return this.getResponse(row, "read", payload);
            }
            const options = {};
            if (transaction) {
                options.transaction = transaction;
            }
            if (!error && mode === this.constant?.action?.create) {
                options.ignoreDuplicates = true;
            }
            if (!error && (mode >= this.constant?.action?.write || mode === this.constant?.action?.update)) {
                options.updateOnDuplicate = (Array.isArray(payload.updateOnDuplicate) && payload.updateOnDuplicate) ||
                    (Array.isArray(this.updateOnDuplicate) && this.updateOnDuplicate)
                    || this.getPKs();
            }
            if (!row && (mode >= this.constant?.action?.write || mode === this.constant?.action?.create)) {
                opt.action = "create";
                let res = model[Array.isArray(data) ? "bulkCreate" : opt.action](this.getRequest(data, opt.action, payload), options);
                return this.getResponse(await res, opt.action, payload);
            }
            if (row && (mode >= this.constant?.action?.write || mode === this.constant?.action?.update) && this.utl?.isDifferent(row, data)) {
                opt.action = "update";
                if (strict && !Array.isArray(data) && options.updateOnDuplicate) {
                    let tmp = {};
                    for (let i of options.updateOnDuplicate) {
                        if (data[i] !== undefined && row[i] !== data[i]) {
                            tmp[i] = data[i];
                        }
                    }
                    if (Object.keys(tmp).length === 0) {
                        return this.getResponse(row, opt.action, payload);
                    }
                    payload.tmp.data = data;
                    data = tmp;
                }
                if (opt?.reload || opt?.reload === undefined) {
                    options.returning = true;
                    options.include = this.getInclude(payload, opt);
                }
                let res = Array.isArray(data) ?
                    await model.bulkCreate(this.getRequest(data, opt.action, payload, row), options) :
                    await row.update(this.getRequest(data, opt.action, payload, row), options);
                options.returning && options.include && (res = await res.reload({ include: options.include }));
                return this.getResponse(res, opt.action, payload);
            }
            return this.getResponse(row, opt.action, payload);
        } catch (error) {
            const logger = this.getLogger();
            logger?.error({
                flow: opt?.flow,
                src: "KsMf:DAO:" + this.modelName + ":Save",
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
     * @param {String} [payload.sql]
     * @param {Object} [payload.params] 
     * @param {Object} [payload.options] 
     * @param {String} [payload.src] 
     * @param {String} [payload.flow] 
     * @param {Error} [payload.error] 
     * @returns {Promise<any>} result 
     */
    async query(payload = {}) {
        try {
            payload = payload || {};
            const driver = this.getDriver();
            let sql = payload.sql.replace(/:table/ig, this.getTableName());
            let params = payload.params || {};
            let options = {
                replacements: params
            };
            if (/^[\n|\r|\s]*SELECT/ig.test(sql)) {
                options.type = driver.QueryTypes.SELECT
            }
            sql = sql.replace(/\n/g, "").replace(/\s\s/g, " ");
            return await driver.query(sql, payload.options || options);
        }
        catch (error) {
            payload.error = error;
            const logger = this.getLogger();
            logger?.error({
                flow: payload.flow,
                data: payload.params,
                src: "KsMf:DAO:" + this.modelName + ":" + (payload.src || "Query"),
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
     * @returns {Promise<any>} row
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
                src: "KsMf:DAO:" + this.modelName + ":Delete",
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
        payload = payload || {};
        payload.mode = this.constant?.action?.create;
        return this.save(payload, opt);
    }

    /**
     * @description update an entity
     * @param {Object} payload 
     * @param {Object} [payload.data] 
     * @param {Object} [payload.where] 
     * @param {Object} [payload.row] 
     * @param {Number} [payload.mode] 
     * @param {Object} [payload.transaction] 
     * @param {boolean} [payload.strict] 
     * @param {any[]} [payload.updateOnDuplicate] 
     * @param {Object} [opt] 
     * @returns {Object} row
     */
    update(payload, opt) {
        payload = payload || {};
        payload.mode = this.constant?.action?.update;
        return this.save(payload, opt);
    }

    /**
     * @description update an entity
     * @param {Object} target
     * @param {Object|String|Number} [target.query] 
     * @param {Array} [target.attributes] 
     * @param {Object} [target.include] 
     * @param {Array<String>} [target.exclude] 
     * @param {Object} [target.where] 
     * @param {Number} [target.limit] 
     * @param {Object} [payload] 
     * @param {Object} [payload.data] 
     * @param {Number} [payload.mode] 
     * @param {Object} [payload.transaction] 
     * @param {boolean} [payload.strict] 
     * @param {any[]} [payload.updateOnDuplicate] 
     * @param {Object} [option] 
     * @returns {Promise<Object>} row
     */
    async clone(target, payload, option) {
        payload = payload || {};
        payload.mode = this.constant?.action?.create;
        target && (target.limit = 1);
        let targetRow = target ? await this.select(target, option) : null;
        let contentRow = targetRow?.dataValues || targetRow;
        if (!contentRow && option?.strict) {
            const logger = this.getLogger();
            logger?.error({
                flow: option?.flow,
                src: "KsMf:DAO:" + this.modelName + ":clone",
                data: payload,
                error: { message: "Target not found" },
            });
            return null;
        } else {
            contentRow = contentRow || {};
        }
        if (targetRow) {
            let keys = this.getPKs()
            for (let key of keys) {
                delete contentRow[key];
            }
            if (Array.isArray(target?.exclude)) {
                for (let i in target.exclude) {
                    delete contentRow[target.exclude[i]];
                }
            }
        }
        const content = payload?.data || payload;
        payload.data = { ...contentRow, ...content };
        return this.save(payload, option);
    }

    /**
     * @description get count of data from model
     * @param {Object} options 
     * @param {String} [options.col] specify the column on which you want to call the count() method with the col
     * @param {Boolean} [options.distinct] tell Sequelize to generate and execute a COUNT( DISTINCT( lastName ) ) query 
     * @returns {Promise<number>}
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
     * @param {Array} filter 
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
     * @returns {{ page?: Number; size?: Number; filter?: Object; query?: Object; order?:Array}}
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