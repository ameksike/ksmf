/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @dependencies sequelize, fs, path
 * */
class DAOSequelize {

    constructor(opt) {
        this.models = {};
        this.driver = null;
        this.manager = require('sequelize');
        this.option = {
            "url": "",
            "path": "",
            "port": "5432",
            "host": "127.0.0.1",
            "database": "default",
            "username": "postgres",
            "password": "postgres",
            "protocol": "postgres",
            "dialect": "postgres",
            "logging": true
        };
        this.config = {};
    }

    configure(payload = null) {
        this.option = payload || this.option;
        const Sequelize = this.manager;
        if (this.option.url) {
            this.driver = new Sequelize(this.option.url, {
                dialect: this.option.dialect,
                protocol: this.option.protocol,
                logging: (str) => this.log(str),
                "dialectOptions": {
                    "ssl": {
                        "rejectUnauthorized": false
                    }
                }
            });
        } else {
            this.driver = new Sequelize(
                this.option.database,
                this.option.username,
                this.option.password,
                {
                    logging: (str) => this.log(str),
                    ...this.option,
                }
            );
        }
        return this;
    }

    connect() {
        this.driver.authenticate().then((error) => {
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

    disconnect() {
        if (this.driver && this.driver.close instanceof Function) {
            this.driver.close();
        }
        return this;
    }

    getUri() {
        return this.option ? `${this.option.protocol}://${this.option.username}:${this.option.password}@${this.option.host}:${this.option.port}/${this.option.database}` : '';
    }

    load(dirname) {
		const fs = require('fs');
        const path = require('path');
        const Sequelize = this.manager;
        if (!this.driver || !fs || !fs.existsSync(dirname)) {
            return;
        }
        fs
            .readdirSync(dirname)
            .filter(file => {
                return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
            })
            .forEach(file => {
                const target = require(path.join(dirname, file));
                if (target instanceof Function) {
                    const model = target(this.driver, Sequelize.DataTypes);
                    this.models[model.name] = model;
                }
            });

        Object.keys(this.models).forEach(modelName => {
            if (this.models[modelName] && this.models[modelName].associate) {
                this.models[modelName].associate(this.models);
            }
        });
        return this;
    }

    log() {
        if (this.option && this.option.logging) {
            if (this.onLog instanceof Function) {
                this.onLog(...arguments);
            }
        }
    }

    onLog() {
        console.log('[KSMF.DAO.Sequelize]', ...arguments);
    }

    onError(error) {
        const message = error.message ? error.message : error;
        this.log('[ERROR]', message);
    }

    onConnect(option) {
        this.log('DATABASE CONNECTION SUCCESS');
    }
}
module.exports = DAOSequelize;