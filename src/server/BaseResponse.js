/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		28/02/2024
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @link        https://fastify.dev/docs/latest/Reference/Reply/
 * @link        https://expressjs.com/en/4x/api.html#res
 */
class BaseResponse {

    get request() {
        return this.drv?.request;
    }
    get sent() {
        return this.drv?.sent;
    }

    constructor(driver) {
        this.name = 'base';
        this.drv = driver
    }

    send(content) {
        this.drv.send(content);
        return this;
    }

    status(value = 200) {
        this.drv.code(value);
        return this;
    }

    code(value = 200) {
        return this.status(value);
    }

    end() {
        this.drv.send();
        return this;
    }

    json(content) {
        this.drv.send(content);
        return this;
    }

    redirect(...attr) {
        this.drv.redirect(...attr);
        return this;
    }

    append(field, value) {
        this.drv.header(field, value);
        return this;
    }

    headers(value) {
        this.drv.headers(value);
        return this;
    }

    getHeader(key) {
        return this.drv?.getHeader(key);
    }
}
module.exports = BaseResponse;