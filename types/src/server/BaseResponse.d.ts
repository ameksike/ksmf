export = BaseResponse;
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
declare class BaseResponse {
    constructor(driver: any);
    get request(): any;
    get sent(): any;
    name: string;
    drv: any;
    send(content: any): this;
    status(value?: number): this;
    code(value?: number): this;
    end(): this;
    json(content: any): this;
    redirect(...attr: any[]): this;
    append(field: any, value: any): this;
    headers(value: any): this;
    getHeader(key: any): any;
}
