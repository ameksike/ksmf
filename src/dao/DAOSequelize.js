/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @dependencies sequelize, fs, path
 * */
const DAOBase = require('./DAOBase');

class DAOSequelize extends DAOBase {
    /**
     * @description redefine constructor and set Sequelize ORM dependence
     */
    constructor() {
        super();
        this.manager = require('sequelize');
        this.option.port = this.option.port || 5432;
    }

    /**
     * @description initialize Sequelize manager
     * @returns {OBJECT} self
     */
    initManager() {
        if (!this.manager || this.driver) {
            return this;
        }
        const Sequelize = this.manager;
        const opts = {
            /*
            dialect: this.option.dialect,
            protocol: this.option.protocol,
            dialectOptions: this.option.dialectOptions || {
                "ssl": {
                    "rejectUnauthorized": false
                }
            },*/
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

        /*if (this.option.url || this.option.use_env_variable) {
            this.option.url = this.option.url || process.env[this.option.use_env_variable];
            this.driver = new Sequelize(this.option.url, opts);
        } else {
            this.driver = new Sequelize(
                this.option.database,
                this.option.username,
                this.option.password,
                opts
            );
        }*/
        return this;
    }

    /**
     * @description redefine connect method
     * @returns {OBJECT} self
     */
    connect() {
        this.initManager();
        this.driver
            .authenticate()
            .then((error) => {
                if (!!error) {
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
     * @returns {OBJECT} self
     */
    disconnect() {
        if (this.driver && this.driver.close instanceof Function) {
            this.driver.close();
        }
        return this;
    }

    /**
     * @description load load models from dirname
     * @param {STRING} dirname 
     * @returns {OBJECT}
     */
    load(dirname) {
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
                    return (file !== 'index.js') && (file.slice(-3) === '.js');
                })
                .forEach(file => {
                    const target = require(path.join(dirname, file));
                    if (target instanceof Function) {
                        const model = target(this.driver, Sequelize.DataTypes);
                        this.models[model.name] = model;
                    }
                });
        }
        catch (error) {
            /*if (this.onError instanceof Function) {
                this.onError(error);
            }*/
        }
        return this;
    }

    /**
     * @description create models associations
     * @returns {OBJECT}
     */
    associate() {
        Object.keys(this.models).forEach(modelName => {
            if (this.models[modelName] && this.models[modelName].associate) {
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
        log && log({
            src: "KSMF.DAO.Sequelize",
            message
        });
    }

    /**
     * @description add column if it doesn't exist
     * @param {OBJECT} queryInterface
     * @param {OBJECT} Sequelize  
     * @param {STRING} tableName 
     * @param {STRING} columnName 
     * @param {OBJECT} options 
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
     * @param {OBJECT} queryInterface
     * @param {STRING} tableName 
     * @param {STRING} columnName 
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
     * @param {OBJECT} queryInterface
     * @param {OBJECT} Sequelize  
     * @param {STRING} tableName 
     * @param {STRING} columnName 
     * @param {OBJECT} options 
     * @return {Promise} 
     */
    static changeColumn(queryInterface, Sequelize, tableName, columnName, options) {
        return queryInterface.changeColumn(tableName, columnName, options);
    }

    /**
     * @description perform sql query
     * @param {OBJECT} queryInterface
     * @param {STRING} sql  
     * @return {Promise} 
     */
    static query(queryInterface, sql) {
        return queryInterface.sequelize.query(sql);
    }

    /**
     * @description run sql file
     * @param {OBJECT} queryInterface
     * @param {STRING} file  
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
}
module.exports = DAOSequelize;