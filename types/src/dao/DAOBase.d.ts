export = DAOBase;
declare const DAOBase_base: typeof import("ksdp/types/src/integration/Dip");
/**
 * @typedef {import('../types').TList} TList
 */
declare class DAOBase extends DAOBase_base {
    /**
     * @description initialize DAO Base model
     * @param {Object} opt
     */
    constructor(opt?: any);
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Object|null}
     */
    manager: any | null;
    /**
     * @type {Object|null}
     */
    models: any | null;
    /**
     * @type {Object|null}
     */
    driver: any | null;
    /**
     * @type {TList|null}
     */
    option: TList | null;
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
     * @param {String|Number} type
     * @param {*} message
     */
    log(type: string | number, message: any): void;
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
declare namespace DAOBase {
    export { TList };
}
type TList = import('../types').TList;
