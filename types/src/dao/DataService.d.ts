export = DataService;
declare const DataService_base: typeof import("ksdp/types/src/integration/Dip");
declare class DataService extends DataService_base {
    constructor(cfg: any);
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    utl: Utl;
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
    configure(cfg: {
        modelName?: string;
        modelKey?: string;
        modelKeys?: any[];
        modelKeyStr?: string;
        modelInclude?: any;
        modelStatus?: string;
        updateOnDuplicate?: any[];
        constant?: any;
        utl?: any;
        dao?: {
            models?: any;
            driver?: any;
            manager?: any;
        };
        logger?: any;
    }): DataService;
    modelName: any;
    modelKey: any;
    modelKeys: any;
    modelKeyStr: any;
    modelInclude: any;
    modelStatus: any;
    updateOnDuplicate: any;
    dao: any;
    constant: any;
    /**
     * @description get paginator options
     * @param {Object} payload
     * @param {Object} [options]
     * @returns {Object}
     */
    getPaginator(payload: any, options?: any): any;
    /**
     * @description format the where clause
     * @param {Object} payload
     * @param {Object} [options]
     * @returns {Object}
     */
    getWhere({ where, query }: any, options?: any): any;
    /**
     * @description format the include clause
     * @param {Object} payload
     * @param {Object} options
     * @returns {Object} include
     */
    getInclude({ include }: any, options: any): any;
    /**
     * @description format the filters on count
     * @param {Object} payload
     * @param {Object} options
     * @returns {Object}
     */
    getCountFilter(payload: any, options: any): any;
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
    iSingle(payload: {
        where?: any;
        auto?: boolean;
        limit?: number;
        quantity?: string;
    }, opt: any): boolean;
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
    select(payload: {
        query?: any | string | number;
        attributes?: any[];
        include?: any;
        where?: any;
        quantity?: string;
        limit?: number;
        page?: number;
        size?: number;
        order?: string;
        jump?: number;
        auto?: boolean;
        valid?: boolean;
        tmp?: any;
    }, opt: any): Promise<any>;
    /**
     * @description format request payload before perform the query
     * @param {Object} data
     * @param {String} [action]
     * @param {Object} [options]
     * @param {Object} [row]
     * @returns {Object}
     */
    getRequest(data: any, action?: string, options?: any, row?: any): any;
    /**
     * @description format the result of the query
     * @param {Object} data
     * @param {String} [action]
     * @param {Object} [options]
     * @returns {Object}
     */
    getResponse(data: any, action?: string, options?: any): any;
    /**
     * @description get the object model
     * @returns {Object}
     */
    getModel(name?: any): any;
    getDriver(): any;
    driver: any;
    getManager(): any;
    manager: any;
    /**
     * @description get attributes map
     * @param {Object|Array} lst
     * @param {Number} [mode]
     * @returns {Object} attributes
     */
    getAttrs(lst: any | any[], mode?: number): any;
    /**
     * @description verify an attribute from the model
     * @param {String} key
     * @param {Object} map
     * @returns {Object} Attribute or null
     */
    hasAttr(key: string, map: any): any;
    /**
     * @description get the primary key
     * @returns {Array<string>}
     */
    getPKs(): Array<string>;
    /**
     * @description get the table name
     * @returns  {String}
     */
    getTableName(name?: any): string;
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
    save(payload: {
        data?: any;
        where?: any;
        row?: any;
        mode?: number;
        strict?: boolean;
        error?: boolean;
        tmp?: any;
        flow?: string;
        updateOnDuplicate?: any[];
        transaction?: any;
    }, opt?: {
        action?: string;
        flow?: string;
        error?: any;
        reload?: boolean;
    }): Promise<any>;
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
    query(payload?: {
        sql?: string;
        params?: any;
        options?: any;
        src?: string;
        flow?: string;
        error?: Error;
    }): Promise<any>;
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
    delete(payload: {
        data: any;
        where: any;
        row: any;
        mode: number;
        transaction: any;
    }, opt: any): Promise<any>;
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
    create(payload: {
        data: any;
        where: any;
        row: any;
        mode: number;
        transaction: any;
    }, opt: any): any;
    /**
     * @description insert an entity
     * @param {Object} payload
     * @param {Object} [payload.data]
     * @param {Object} [payload.where]
     * @param {Object} [payload.row]
     * @param {Number} [payload.mode]
     * @param {Object} [payload.transaction]
     * @returns {Object} row
     */
    insert(payload: {
        data?: any;
        where?: any;
        row?: any;
        mode?: number;
        transaction?: any;
    }, opt: any): any;
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
    update(payload: {
        data?: any;
        where?: any;
        row?: any;
        mode?: number;
        transaction?: any;
        strict?: boolean;
        updateOnDuplicate?: any[];
    }, opt?: any): any;
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
    clone(target: {
        query?: any | string | number;
        attributes?: any[];
        include?: any;
        exclude?: Array<string>;
        where?: any;
        limit?: number;
    }, payload?: {
        data?: any;
        mode?: number;
        transaction?: any;
        strict?: boolean;
        updateOnDuplicate?: any[];
    }, option?: any): Promise<any>;
    /**
     * @description get count of data from model
     * @param {Object} options
     * @param {String} [options.col] specify the column on which you want to call the count() method with the col
     * @param {Boolean} [options.distinct] tell Sequelize to generate and execute a COUNT( DISTINCT( lastName ) ) query
     * @returns {Promise<number>}
     */
    count(options?: {
        col?: string;
        distinct?: boolean;
    }): Promise<number>;
    /**
     * @description get filters as query
     *              see: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
     * @param {Array} filter
     */
    asQuery(filter: any[]): {};
    /**
     * @description get sort obtion as order format
     *              see: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering-and-grouping
     * @param {Array} sort
     * @returns {Array} order options
     */
    asOrder(sort: any[]): any[];
    /**
     * @description Get Logger Object
     * @returns {Object} Logger
     */
    getLogger(): any;
    /**
     * @description Extract hotkeys from request parameters
     * @param {Object} req
     * @returns {{ page?: Number; size?: Number; filter?: Object; query?: Object; order?:Array}}
     */
    extract(req: any): {
        page?: number;
        size?: number;
        filter?: any;
        query?: any;
        order?: any[];
    };
}
import Utl = require("../common/Utl");
