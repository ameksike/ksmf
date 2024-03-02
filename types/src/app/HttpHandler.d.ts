export = HttpHandler;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
declare class HttpHandler {
    ation: {
        200: (res: any) => void;
        400: (res: any) => void;
        403: (res: any) => void;
        407: (res: any) => void;
        500: (res: any) => void;
        custom: (res: any, message: any, code?: number) => void;
    };
    /**
     * @description safely http response
     * @param {Object} res
     * @param {String} code
     * @param {String} message
     */
    send(res: any, code: string, message: string): boolean;
}
