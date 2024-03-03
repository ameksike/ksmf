/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @requires    ioredis
 **/
const DAOBase = require('./DAOBase');

class DAORedis extends DAOBase {

    /**
     * @description redefine constructor and set Sequelize ORM dependence
     */
    constructor() {
        super();
        this.cache = {};
        this.sets = {};
        this.option.port = this.option.port || 6379;
        this.option.protocol = this.option.protocol || "rediss";
        this.option.password = this.option.password || "auth";
    }

    /**
     * @description redefine connect method
     * @returns {DAORedis} self
     */
    connect() {
        const cfg = this.option.url ? this.option.url : {
            port: this.option.port,
            host: this.option.host,
            family: this.option.family,
            password: this.option.password,
            db: this.option.database,
            reconnectOnError(err) {
                this.onError(err);
                const targetError = "READONLY";
                if (err.message.includes(targetError)) {
                    // Only reconnect when the error contains "READONLY"
                    return true; // or `return 1;`
                }
            },
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        };
        const Redis = this.helper?.get({
            name: 'ioredis',
            type: 'lib'
        });
        if (!Redis) {
            return null;
        }
        this.driver = new Redis(cfg);
        this.driver.on('connect', () => {
            this.onConnect(this.option);
        });
        return this;
    }

    /**
     * @description redefine disconnect method
     * @returns {DAORedis} self
     */
    disconnect() {
        this.driver.disconnect();
        return this;
    }

    /**
     * @description redefine error event method
     * @param {Error} error 
     */
    onError(error) {
        const message = error.message ? error.message : error;
        if (this.option.logging) {
            console.log('[KSMF.DAO.Redis]', '[ERROR]', message);
        }
    }

    /**
     * @description redefine connect event method
     * @param {Object} option 
     */
    onConnect(option = null) {
        if (this.option.logging) {
            console.log('[KSMF.DAO.Redis]', '[INFO]', 'DATABASE CONNECTION SUCCESS');
            console.log(this.option);
        }
    }

    /**
     * @description allow support for saving json-encoded object as the value of a specific key
     * @param {String} key 
     * @param {*} value 
     * @returns {Promise}
     */
    async set(key, value) {
        if (!this.driver) {
            this.cache[key] = value;
            return Promise.resolve();
        } else {
            value = value instanceof Object ? JSON.stringify(value) : value;
            return this.driver.set(key, value);
        }
    }

    /**
     * @description allow retrieval of json encoded objects from a specific key
     * @param {String} key 
     * @param {Function} callback 
     * @returns 
     */
    async get(key, callback) {
        if (!this.driver) {
            return new Promise(function (resolve, reject) {
                this.driver.get(key, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        try {
                            const data = JSON.parse(result);
                            resolve(data);
                        }
                        catch (error) {
                            resolve(result);
                        }
                    }
                });
            });
        } else {
            const value = this.cache[key];
            if (callback instanceof Function) {
                callback(null, value);
            }
            return Promise.resolve(value);
        }
    }

    /**
     * @description 
     * @param {*} name 
     * @param {*} key 
     * @returns 
     */
    sismember(name, key) {
        if (!this.driver) {
            if (!this.sets[name]) {
                return Promise.resolve(false);
            }
            return Promise.resolve(this.sets[name].has(key));
        } else {
            return this.driver.sismember(name, key);
        }
    }

    /**
     * @description 
     * @param {*} name 
     * @param {*} key 
     * @returns {Promise}
     */
    sadd(name, key) {
        if (!this.driver) {
            if (!this.sets[name]) {
                this.sets[name] = new Set([key]);
                return Promise.resolve();
            }
            this.sets[name].add(key);
            return Promise.resolve();
        } else {
            return this.driver.sadd(name, key);
        }
    }

    /**
     * @description 
     * @param {*} name 
     * @param {*} key 
     * @returns {Promise}
     */
    srem(name, key) {
        if (!this.driver) {
            if (!this.sets[name]) {
                return Promise.resolve();
            }
            this.sets[name].delete(key);
            return Promise.resolve();
        } else {
            return this.driver.srem(name, key);
        }
    }

    /**
     * @description close connection
     * @returns {Promise}
     */
    quit() {
        if (!this.driver) {
            return Promise.resolve();
        } else {
            return this.driver.quit();
        }
    }
}
module.exports = DAORedis;
