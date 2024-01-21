export = DAORedis;
declare class DAORedis extends DAOBase {
    /**
     * @description redefine constructor and set Sequelize ORM dependence
     */
    constructor();
    cache: {};
    sets: {};
    /**
     * @description redefine connect method
     * @returns {DAORedis} self
     */
    connect(): DAORedis;
    /**
     * @description redefine disconnect method
     * @returns {DAORedis} self
     */
    disconnect(): DAORedis;
    /**
     * @description redefine connect event method
     * @param {Object} option
     */
    onConnect(option?: any): void;
    /**
     * @description allow support for saving json-encoded object as the value of a specific key
     * @param {String} key
     * @param {*} value
     * @returns {Promise}
     */
    set(key: string, value: any): Promise<any>;
    /**
     * @description allow retrieval of json encoded objects from a specific key
     * @param {String} key
     * @param {Function} callback
     * @returns
     */
    get(key: string, callback: Function): Promise<any>;
    /**
     * @description
     * @param {*} name
     * @param {*} key
     * @returns
     */
    sismember(name: any, key: any): any;
    /**
     * @description
     * @param {*} name
     * @param {*} key
     * @returns {Promise}
     */
    sadd(name: any, key: any): Promise<any>;
    /**
     * @description
     * @param {*} name
     * @param {*} key
     * @returns {Promise}
     */
    srem(name: any, key: any): Promise<any>;
    /**
     * @description close connection
     * @returns {Promise}
     */
    quit(): Promise<any>;
}
import DAOBase = require("./DAOBase");
