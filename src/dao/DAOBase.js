/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        22/04/2021
 * @copyright   Copyright (c) 2020-2030
 * @license     GPL
 * @version     1.0
 **/
const ksdp = require("ksdp");

/**
 * @typedef {import('../types').TList} TList 
 */
class DAOBase extends ksdp.integration.Dip {

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @type {Object|null}
     */
    helper = null;

    /**
     * @type {Object|null}
     */
    manager = null;

    /**
     * @type {Object|null}
     */
    models = {};

    /**
     * @type {Object|null}
     */
    driver = null;

    /**
     * @type {TList|null}
     */
    option = null;

    /**
     * @description initialize DAO Base model
     * @param {Object} opt 
     */
    constructor(opt = null) {
        super();
        this.models = {};
        this.driver = null;
        this.manager = null;
        this.option = null;
        this.configure(opt);
    }

    /**
     * @description set all configuration options
     * @returns {DAOBase} self
     */
    configure(payload = null) {
        payload && Object.assign(this.option, payload);
        return this;
    }

    /**
     * @description create database connection
     * @returns {DAOBase} self
     */
    connect() {
        return this;
    }

    /**
     * @description close database connection
     * @returns {DAOBase} self
     */
    disconnect() {
        this.driver?.disconnect && this.driver.disconnect();
        return this;
    }

    /**
     * @description load models
     * @param {String} dirname 
     * @returns {DAOBase} self
     */
    load(dirname) {
        return this;
    }

    /**
     * @description redefine logs
     * @param {String|Number} type 
     * @param {*} message 
     */
    onLog(type, message) { };

    /**
     * @description get connection options as string
     * @returns {String}
     */
    getUri() {
        return this.conn2str(this.option);
    }

    /**
     * 
     * @typedef {Object} CfgObj
     * @property {String} [dialect]
     * @property {String} [username]
     * @property {String} [password]
     * @property {String} [database] 
     * @property {String} [protocol]
     * @property {String} [host]
     * @property {String} [port]
     * 
     * @description format string connection dialect://username:password@host:port/database
     * @param {CfgObj|String} cfg 
     */
    conn2str(cfg) {
        if (!cfg) return '';
        if (typeof (cfg) === 'string') return cfg;
        const password = cfg.password ? ':' + cfg.password : '';
        const username = cfg.username || ''; //!cfg.username ? '' : (cfg.username + password + '@');
        const account = username || password ? username + password + '@' : '';
        const port = cfg.port ? ':' + cfg.port : '';
        const host = (!cfg.host ? '127.0.0.1' : cfg.host) + port;
        const database = cfg.database ? '/' + cfg.database : '';
        const protocol = cfg.protocol || cfg.dialect || 'postgres';
        return protocol + '://' + account + host + database;
    }

    /**
     * @description dispatch onLoad event
     * @param {String|Number} type 
     * @param {*} message 
     */
    log(type, message) {
        if (this.onLog instanceof Function) {
            this.onLog(type, message);
        }
    }

    /**
     * @description on error event
     * @param {Object} error 
     */
    onError(error) {
        const message = error.message ? error.message : error;
        this.log('error', message);
    }
    /**
     * @description on connect event
     * @param {Object} option 
     */
    onConnect(option) {
        this.log('info', 'DATABASE CONNECTION SUCCESS');
    }

    /**
     * @description on disconnect event
     * @param {Object} option 
     */
    onDisconnect(option) { }
}
module.exports = DAOBase;