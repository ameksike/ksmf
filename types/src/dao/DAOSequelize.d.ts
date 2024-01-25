export = DAOSequelize;
declare class DAOSequelize extends DAOBase {
    /**
     * @description add column if it doesn't exist
     * @param {Object} queryInterface
     * @param {Object} Sequelize
     * @param {String} tableName
     * @param {String} columnName
     * @param {Object} options
     * @return {Promise}
     */
    static addColumn(queryInterface: any, Sequelize: any, tableName: string, columnName: string, options: any): Promise<any>;
    /**
     * @description remove column if it exists
     * @param {Object} queryInterface
     * @param {String} tableName
     * @param {String} columnName
     * @return {Promise}
     */
    static removeColumn(queryInterface: any, tableName: string, columnName: string): Promise<any>;
    /**
     * @description change column
     * @param {Object} queryInterface
     * @param {Object} Sequelize
     * @param {String} tableName
     * @param {String} columnName
     * @param {Object} options
     * @return {Promise}
     */
    static changeColumn(queryInterface: any, Sequelize: any, tableName: string, columnName: string, options: any): Promise<any>;
    /**
     * @description perform sql query
     * @param {Object} queryInterface
     * @param {String} sql
     * @return {Promise}
     */
    static query(queryInterface: any, sql: string): Promise<any>;
    /**
     * @description run sql file
     * @param {Object} queryInterface
     * @param {String} file
     * @return {Promise}
     */
    static run(queryInterface: any, file: string): Promise<any>;
    /**
     * @description allow generating models from db
     * @param {Object} config
     * @returns {Promise<any>} res
     */
    static process(config: any, logger: any): Promise<any>;
    /**
     * @description redefine constructor and set Sequelize ORM dependence
     */
    constructor();
    /**
     * @type {Object|null}
     */
    models: any | null;
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @description initialize Sequelize manager
     * @returns {DAOSequelize} self
     */
    initManager(): DAOSequelize;
    /**
     * @description redefine connect method
     * @returns {DAOSequelize} self
     */
    connect(): DAOSequelize;
    /**
     * @description redefine disconnect method
     * @returns {DAOSequelize} self
     */
    disconnect(): DAOSequelize;
    /**
     * @description load load models from dirname
     * @param {String} dirname
     * @param {Function} [callback]
     * @returns {DAOSequelize} self
     */
    load(dirname: string, callback?: Function): DAOSequelize;
    /**
     * @description create models associations
     * @returns {DAOSequelize} self
     */
    associate(): DAOSequelize;
    /**
     * @description redefine logs
     */
    onLog(type: any, message: any): void;
}
import DAOBase = require("./DAOBase");
