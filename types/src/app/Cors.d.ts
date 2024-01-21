export = CorsWrapper;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 */
declare class CorsWrapper {
    /**
     * @description load DAO lib and load project models
     */
    onInitApp(web: any, app: any): void;
    /**
     * @description Allow all origin request, CORS on ExpressJS
     * @param {Object} cfg
     * @returns {Object} [env=process.env]
     */
    getCors(cfg: any, env?: NodeJS.ProcessEnv): any;
}
