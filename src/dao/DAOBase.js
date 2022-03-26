/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class DAOBase {
    /**
     * @description initialize DAO Base model
     * @param {OBJECT} opt 
     */
    constructor(opt = null) {
        this.models = {};
        this.driver = null;
        this.manager = null;
        this.option = {
            "url": "",
            "path": "",
            "port": null,
            "host": "127.0.0.1",
            "database": "default",
            "username": "postgres",
            "password": "postgres",
            "protocol": null,
            "logging": false
        };
        this.configure(opt);
    }

    /**
     * @description set all configuration options
     * @returns {OBJECT} self
     */
    configure(payload = null) {
        if (!payload) return this;
        for (let i in payload) {
            this.option[i] = payload[i];
        }
        return this;
    }

    /**
     * @description create database connection
     * @returns {OBJECT} self
     */
    connect() {
        return this;
    }

    /**
     * @description close database connection
     * @returns {OBJECT} self
     */
    disconnect() {
        if (this.driver && this.driver.disconnect) {
            this.driver.disconnect();
        }
        return this;
    }

    /**
     * @description load models
     * @param {STRING} dirname 
     * @returns {OBJECT} self
     */
    load(dirname) {
        return this;
    }

    /**
     * @description get connection options as string
     * @returns {STRING}
     */
    getUri() {
        return this.conn2str(this.option);
    }

    /**
     * @description format string connection dialect://username:password@host:port/database
     * @param {OBJECT|STRING} cfg 
     * @param {STRING} cfg.dialect
     * @param {STRING} cfg.username
     * @param {STRING} cfg.password
     * @param {STRING} cfg.database
     * @param {STRING} cfg.host
     * @param {STRING} cfg.port
     */
    conn2str(cfg) {
        if (!cfg) return '';
        if (typeof (cfg) === 'string') return cfg;
        const password = cfg.password ? ':' + cfg.password : '';
        const username = cfg.username || ''; //!cfg.username ? '' : (cfg.username + password + '@');
        const account = username || password  ? username + password + '@'  : '';
        const port = cfg.port ? ':' + cfg.port : '';
        const host = (!cfg.host ? '127.0.0.1' : cfg.host) + port;
        const database = cfg.database ? '/' + cfg.database : '';
        const protocol = cfg.protocol || cfg.dialect || 'postgres';
        return protocol + '://' + account + host + database;
    }

    /**
     * @description dispatch onLoad event
     */
    log() {
        if (this.option && this.option.logging) {
            if (this.onLog instanceof Function) {
                this.onLog(...arguments);
            }
        }
    }

    /**
     * @description on error event
     * @param {OBJECT} error 
     */
    onError(error) {
        const message = error.message ? error.message : error;
        this.log('[ERROR]', message);
    }
    /**
     * @description on connect event
     * @param {OBJECT} option 
     */
    onConnect(option) {
        this.log('[INFO]', 'DATABASE CONNECTION SUCCESS');
    }

    /**
     * @description get log level
     * @returns {NUMBER}
     */
    getLogLevel(){
        return this.option && this.option.log ? this.option.log : 2;
    }

    /**
     * @description on disconnect event
     * @param {OBJECT} option 
     */
    onDisconnect(option) { }
}
module.exports = DAOBase;