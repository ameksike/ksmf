/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 */
class CorsWrapper {

    /**
     * @description load DAO lib and load project models
     */
    onInitApp(web, app) {
        if (!web?.use) {
            return;
        }
        web.use(this.getCors(app?.cfg?.srv?.cors));
    }

    /**
     * @description Allow all origin request, CORS on ExpressJS
     * @param {Array} cfg 
     * @returns {Function} middleware
     */
    getCors(cfg, env = process.env) {
        function reg(val) {
            try {
                return new RegExp(val);
            }
            catch (e) {
                return val;
            }
        }
        let allowedOrigins = cfg || [];
        if (env?.CORS_ORIGINS) {
            const CORS_ORIGINS = env?.CORS_ORIGINS || "";
            allowedOrigins = allowedOrigins.concat(CORS_ORIGINS.split(','));
        }
        allowedOrigins = allowedOrigins.map(elm => reg(elm));
        const corsConfig = {
            origin: allowedOrigins.concat('null'),
            allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type', 'Access-Control-Allow-Headers', 'Authorization'],
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: false,
            optionsSuccessStatus: 204,
            maxAge: 86400,
            credentials: true,
        };
        const cors = require('cors');
        return cors(corsConfig);
    }
}
module.exports = CorsWrapper;