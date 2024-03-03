export = BaseRequest;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		28/02/2024
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 */
declare class BaseRequest {
    constructor(driver: any);
    get query(): any;
    get body(): any;
    get params(): any;
    get method(): any;
    get protocol(): any;
    get headers(): any;
    get hostname(): any;
    get originalUrl(): any;
    get ip(): any;
    get options(): any;
    name: string;
    drv: any;
}
