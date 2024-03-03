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

const BaseResponse = require('./BaseResponse');
class FastifyResponse extends BaseResponse {

    constructor(driver) {
        super(driver)
        this.name = 'fastify';
    }
}
module.exports = FastifyResponse;