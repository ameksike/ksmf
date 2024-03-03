/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		28/02/2024
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 */

class BaseRequest {

    get query() {
        return this.drv?.query;
    }
    get body() {
        return this.drv?.body;
    }
    get params() {
        return this.drv?.params;
    }
    get method() {
        return this.drv?.method;
    }
    get protocol() {
        return this.drv?.protocol;
    }
    get headers() {
        return this.drv?.headers;
    }
    get hostname() {
        return this.drv?.hostname;
    }
    get originalUrl() {
        return this.drv?.originalUrl;
    }
    get ip() {
        return this.drv?.ip;
    }
    get options() {
        return this.drv?.routeOptions;
    }

    constructor(driver) {
        this.name = 'base';
        this.drv = driver
    }
}
module.exports = BaseRequest;