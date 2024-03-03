/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @dependencies sequelize, fs, path
 * @requires    sequelize
 * @requires    sequelize-auto
 **/
const DAOBase = require('./DAOBase');

class DAOSequelize extends DAOBase {

    /**
     * @description initialize Sequelize manager
     * @returns {DAOSequelize} self
     */
    initManager() {
        this.manager = this.manager || this.helper?.get({
            name: 'sequelize',
            type: 'package'
        });
        if (!this.manager || this.driver) {
            return this;
        }
        const Sequelize = this.manager;
        const opts = {
            define: {
                timestamps: false
            },
            pool: {
                max: 30,
                min: 3,
                acquire: 30000,
                idle: 10000,
            },
            retry: {
                match: [
                    Sequelize.ConnectionError,
                    Sequelize.ConnectionTimedOutError,
                    Sequelize.TimeoutError,
                    /Deadlock/i
                ],
                max: 3
            },
            benchmark: true,
            logging: (msg, timingMs) => {
                if ("Executed (default): SELECT 1+1 AS result" !== msg) {
                    this.log('debug', {
                        src: "models:db:query",
                        message: msg,
                        data: { timingMs }
                    });
                }
            },
            logQueryParameters: true,
            ...this.option
        };

        const url = this.option.url || this.conn2str(this.option);
        this.driver = new Sequelize(url, opts);
        return this;
    }

    /**
     * @description redefine connect method
     * @returns {DAOSequelize} self
     */
    connect() {
        this.initManager();
        this.driver
            .authenticate()
            .then((error) => {
                if (error) {
                    if (this.onError instanceof Function) {
                        this.onError(error);
                    }
                } else {
                    this.onConnect(this.option);
                }
            })
            .catch((error) => {
                if (this.onError instanceof Function) {
                    this.onError(error);
                }
            });
        return this;
    }

    /**
     * @description redefine disconnect method
     * @returns {DAOSequelize} self
     */
    disconnect() {
        if (this.driver?.close instanceof Function) {
            this.driver.close();
        }
        return this;
    }

    /**
     * @description load load models from dirname
     * @param {String} dirname 
     * @param {Function} [callback] 
     * @returns {DAOSequelize} self
     */
    load(dirname, callback) {
        const fs = require('fs');
        const path = require('path');
        const Sequelize = this.manager;
        if (!this.driver) {
            return this;
        }
        try {
            fs
                .readdirSync(dirname)
                .filter(file => {
                    return (file !== 'index.js') && (file.endsWith('.js'));
                })
                .forEach(file => {
                    const target = require(path.join(dirname, file));
                    if (target instanceof Function) {
                        const model = target(this.driver, Sequelize.DataTypes);
                        this.models[model.name] = model;
                        if (callback instanceof Function) {
                            callback(model.name, model, this.models);
                        }
                    }
                });
        }
        catch (error) { }
        return this;
    }

    /**
     * @description create models associations
     * @returns {DAOSequelize} self
     */
    associate() {
        Object.keys(this.models).forEach(modelName => {
            if (this.models[modelName]?.associate) {
                this.models[modelName].associate(this.models);
            }
        });
        return this;
    }

    /**
     * @description redefine logs
     */
    onLog(type, message) {
        const logger = this.helper?.get("logger");
        const log = logger ? logger[type] : null;
        (log instanceof Function) && log({
            src: "KSMF.DAO.Sequelize",
            message
        });
    }

    /**
     * @description add column if it doesn't exist
     * @param {Object} queryInterface
     * @param {Object} Sequelize  
     * @param {String} tableName 
     * @param {String} columnName 
     * @param {Object} options 
     * @return {Promise} 
     */
    static addColumn(queryInterface, Sequelize, tableName, columnName, options) {
        options = options || { type: Sequelize.STRING, allowNull: true };
        return queryInterface.describeTable(tableName).then(tableDefinition => {
            if (!tableDefinition[columnName]) {
                return queryInterface.addColumn(tableName, columnName, options);
            } else {
                return Promise.resolve(true);
            }
        });
    }

    /**
     * @description remove column if it exists
     * @param {Object} queryInterface
     * @param {String} tableName 
     * @param {String} columnName 
     * @return {Promise} 
     */
    static removeColumn(queryInterface, tableName, columnName) {
        return queryInterface.describeTable(tableName).then(tableDefinition => {
            if (tableDefinition[columnName]) {
                return queryInterface.removeColumn(tableName, columnName);
            } else {
                return Promise.resolve(true);
            }
        });
    }

    /**
     * @description change column
     * @param {Object} queryInterface
     * @param {Object} Sequelize  
     * @param {String} tableName 
     * @param {String} columnName 
     * @param {Object} options 
     * @return {Promise} 
     */
    static changeColumn(queryInterface, Sequelize, tableName, columnName, options) {
        return queryInterface.changeColumn(tableName, columnName, options);
    }

    /**
     * @description perform sql query
     * @param {Object} queryInterface
     * @param {String} sql  
     * @return {Promise} 
     */
    static query(queryInterface, sql) {
        return queryInterface.sequelize.query(sql);
    }

    /**
     * @description run sql file
     * @param {Object} queryInterface
     * @param {String} file  
     * @return {Promise} 
     */
    static async run(queryInterface, file) {
        const fs = require('fs');
        if (!queryInterface || !file) {
            throw new Error('Query Interface is null or the file is empty');
        }
        if (!fs.existsSync(file)) {
            throw new Error('File no exists : ' + file);
        }
        const sql = fs.readFileSync(file, 'utf8');
        if (!sql) {
            throw new Error('Script is empty or not utf8 format');
        }
        return await queryInterface.sequelize.query(sql);
    }

    /**
     * @description allow generating models from db
     * @param {Object} config 
     * @returns {Promise<any>} res
     */
    static async process(config, logger) {
        const path = require('path');
        const output = path.join(__dirname, "../db/models");
        const defaults = {
            directory: output,
            caseFile: 'l',
            caseModel: 'p',
            caseProp: 'c',
            lang: config?.lang || 'js',  // ts,js
            useDefine: false,
            singularize: true,
            spaces: true,
            indentation: 2
        };
        const options = Object.assign({}, defaults, config || {});
        try {
            const SequelizeAuto = require('sequelize-auto');
            const auto = new SequelizeAuto(
                config.database,
                config.username,
                config.password,
                options
            );
            const res = await auto.run();
            const tableNames = Object.keys(res.tables);
            logger?.info && logger.info({
                src: "models:db:auto:process",
                message: "Importation success",
                data: tableNames
            });
            return res;
        }
        catch (error) {
            logger?.error && logger.error({
                src: "models:db:auto:process",
                message: error?.message || error,
                data: { config, options }
            });
        }
    }
}
module.exports = DAOSequelize;