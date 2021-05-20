/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class DAOBase {

    constructor(opt) {
        this.driver = null;
        this.option = {
            "url": "",
            "port": 6379,
            "family": 4,
            "host": "127.0.0.1",
            "path": "",
            "database": "default",
            "username": "",
            "password": "",
            "protocol": "sqlite",
            "logging": true
        };
        this.configure(opt);
    }

    configure(payload = null) {
        for (let i in payload) {
            this.option[i] = payload[i];
        }
        return this;
    }

    connect() {
        return this;
    }

    disconnect() {
        if (this.driver && this.driver.disconnect) {
            this.driver.disconnect();
        }
        return this;
    }

    load(dirname) {
        return this;
    }

    getUri() {
        return `${this.option.protocol}://${this.option.username}:${this.option.password}@${this.option.host}:${this.option.port}/${this.option.database}`;
    }

    onError(error) {}
    onConnect(option) {}
    onDisconnect(option) {}
}
module.exports = DAOBase;