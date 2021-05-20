
const Redis = require("ioredis");
/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @dependencies ioredis
 * */
class DAORedis {

    constructor(opt) {
        this.driver = null;
        this.cache = {};
        this.sets = {};
        this.option = {
            "url": "",
            "port": 6379,
            "family": 4, // 4 (IPv4) or 6 (IPv6)
            "host": "127.0.0.1",
            "database": "default",
            "username": "",
            "password": "auth",
            "protocol": "rediss",
            "logging": true
        };
    }

    configure(payload = null) {
        this.option = payload || this.option;
        return this;
    }

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
        this.driver = new Redis(cfg);
        redis.on('connect', () => {
            this.onConnect(this.option);
        });
        return this;
    }

    disconnect() {
        this.driver.disconnect();
        return this;
    }

    getUri() {
        return `${this.option.protocol}://${this.option.username}:${this.option.password}@${this.option.host}:${this.option.port}/${this.option.database}`;
    }

    load(dirname) { }

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


    async set(key, value) {
        if (!this.driver) {
            this.cache[key] = value;
            return Promise.resolve();
        } else {
            value = value instanceof Object ? JSON.stringify(value) : value;
            return this.driver.set(key, value);
        }
    }

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

    quit() {
        if (!this.driver) {
            return Promise.resolve();
        } else {
            return this.driver.quit();
        }
    }
}
module.exports = DAORedis;
