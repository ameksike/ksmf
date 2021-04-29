const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @dependencies sequelize fs path
 * */
class DAOSequelize {

    constructor(opt) {
        this.models = {};
        this.driver = null;
        this.manager = Sequelize;
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
        if (this.option.url) {
            this.driver = new Sequelize(this.option.url, {
                dialect: this.option.dialect,
                protocol: this.option.protocol,
                logging: this.option.logging,
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
                    logging: this.option.logging,
                    ...this.option,
                }
            );
        }
        return this;
    }

    connect() {
        this.driver.authenticate().then((error) => {
            if (!!error) {
                this.onError(error);
            } else {
                this.onConnect(this.option);
            }
        });
        return this;
    }

    disconnect() {
        this.driver.close();
        return this;
    }

    getUri() {
        return `${this.option.protocol}://${this.option.username}:${this.option.password}@${this.option.host}:${this.option.port}/${this.option.database}`;
    }

    load(dirname) {
        if (!this.driver || !fs.existsSync(dirname)) {
            return;
        }

        fs
            .readdirSync(dirname)
            .filter(file => {
                return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
            })
            .forEach(file => {
                const model = require(path.join(dirname, file))(this.driver, Sequelize.DataTypes);
                this.models[model.name] = model;
            });

        Object.keys(this.models).forEach(modelName => {
            if (this.models[modelName].associate) {
                this.models[modelName].associate(this.models);
            }
        });
        return this;
    }

    onError(error) {
        const message = error.message ? error.message : error;
        if (this.option.logging) {
            console.log('>>> DAO ERROR: data base connect error : ' + message);
        }

    }

    onConnect(option) {
        if (this.option.logging) {
            console.log('>>> DAO data base connect success');
            console.log(this.option);
        }
    }
}
module.exports = DAOSequelize;
