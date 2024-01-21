export = DAOBase;
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
     * @description get connection options as string
     * @returns {String}
     */
    getUri(): string;
    /**
     * @description format string connection dialect://username:password@host:port/database
     * @param {Object|String} cfg
     * @param {String} cfg.dialect
     * @param {String} cfg.username
     * @param {String} cfg.password
     * @param {String} cfg.database
     * @param {String} cfg.host
     * @param {String} cfg.port
     */
    conn2str(cfg: any | string): string;
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
