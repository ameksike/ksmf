export = DAOBase;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
declare class DAOBase {
    /**
     * @description initialize DAO Base model
     * @param {Object} opt
     */
    constructor(opt?: any);
    models: {};
    driver: any;
    manager: any;
    option: {};
    /**
     * @description set all configuration options
     * @returns {DAOBase} self
     */
    configure(payload?: any): DAOBase;
    /**
     * @description create database connection
     * @returns {DAOBase} self
     */
    connect(): DAOBase;
    /**
     * @description close database connection
     * @returns {DAOBase} self
     */
    disconnect(): DAOBase;
    /**
     * @description load models
     * @param {String} dirname
     * @returns {DAOBase} self
     */
    load(dirname: string): DAOBase;
    /**
     * @description redefine logs
     * @param {String|Number} type
     * @param {*} message
     */
    onLog(type: string | number, message: any): void;
    /**
     * @description get connection options as string
     * @returns {String}
     */
    getUri(): string;
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
    conn2str(cfg: string | {
        dialect?: string;
        username?: string;
        password?: string;
        database?: string;
        protocol?: string;
        host?: string;
        port?: string;
    }): string;
    /**
     * @description dispatch onLoad event
     */
    log(...args: any[]): void;
    /**
     * @description on error event
     * @param {Object} error
     */
    onError(error: any): void;
    /**
     * @description on connect event
     * @param {Object} option
     */
    onConnect(option: any): void;
    /**
     * @description on disconnect event
     * @param {Object} option
     */
    onDisconnect(option: any): void;
}
