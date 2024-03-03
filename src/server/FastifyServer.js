/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		28/02/2024
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @link        https://fastify.dev/docs/latest/Reference/Server/#https
 * @requires    fastify 
 * @requires    serve-static 
 * @requires    @fastify/cookie 
 * @requires    @fastify/middie
 */
const https = require('https');
const Response = require('./FastifyResponse');
const Request = require('./FastifyRequest');
const BaseServer = require('./BaseServer');
class FastifyServer extends BaseServer {

    constructor() {
        super();
        this.name = 'fastify';
    }

    /**
     * @description configure the web server
     * @param {Object} [payload]
     * @param {Object} [payload.web]
     * @param {Object} [payload.drv]
     * @param {Object} [payload.logger]
     * @param {Object} [payload.helper]
     * @param {Object} [payload.option]
     * @param {Boolean} [payload.cookie] 
     * @returns {Promise<FastifyServer>} self
     */
    async configure(payload) {
        super.configure(payload);
        this.web = payload?.web || require('fastify')({ logger: !!payload?.logger });
        this.drv = payload?.drv || require('fastify');
        this.drv.static = require('serve-static');
        await this.web.register(require('@fastify/middie'));
        return this;
    }

    /**
     * @description add cookie support
     * @param {Object} cookie 
     */
    initCookie(cookie = null) {
        //... Allow cookie Parser
        this.web.register(require('@fastify/cookie'), {
            secret: cookie?.secret || 'my-secret',
            parseOptions: {}
        });
    }

    /**
     * @description publish static files
     * @param {String} url 
     * @param {String} path 
     */
    publish(url, path) {
        //... Allow static files
        url && path && this.drv && this.web?.use(url, this.drv.static(path));
    }

    /**
     * @description delete routes 
     * @param {String|Array<String>} value 
     * @param {Function} check 
     * @returns {Boolean}
     */
    del(value, check = null) {
        if (!(this.web?._router?.stack?.filter instanceof Function)) {
            return false;
        }
        check = check instanceof Function ? check : ((item, value) => Array.isArray(value) ? !value.includes(item?.route?.path) : item?.route?.path !== value);
        this.web._router.stack = value ? this.web._router.stack.filter(layer => check(layer, value)) : [];
        return true;
    }

    /**
     * @description set a route
     * 
     * @callback Handler
     * @param {Object} [req]
     * @param {Object} [res]
     * @param {Function} [next]
     * 
     * @param {Object} payload 
     * @param {String} payload.route 
     * @param {String} payload.method 
     * @param {Handler} payload.handler 
     * @param {Array} payload.middlewares 
     * @returns {Object} 
     */
    set(payload) {
        const { route, middlewares, handler, method, options = {} } = payload;
        try {
            if (!this.web) {
                return null;
            }
            let action = this.web[method];
            if (!action || !handler || !(handler instanceof Function)) {
                return null;
            }
            if (middlewares) {
                // options.preHandler = Array.isArray(middlewares) ? middlewares : [middlewares];
            }
            return action.apply(this.web, [route, options, (req, res) => handler(new Request(req), new Response(res), null)]);
        }
        catch (_) {
            return null;
        }
    }

    /**
     * @description start the server
     * @param {Object} [payload] 
     * @param {Number} [payload.port]
     * @param {String} [payload.key]
     * @param {String} [payload.cert] 
     * @param {String} [payload.host] 
     * @param {String} [payload.protocol] 
     * @param {Boolean} [payload.secure] 
     * @param {Object} [payload.app] 
     * @param {Function} [payload.callback] 
     */
    start(payload = null) {
        const { key, cert, protocol = 'http', port = 3003, host = '127.0.0.1', app = this.web } = payload || {};
        return new Promise(async (resolve, reject) => {
            try {
                if (protocol === 'https' && key && cert) {
                    https.createServer({ key, cert }, app).listen(port, () => resolve({ port, host, protocol: 'https' }));
                } else {
                    let url = await app.listen({ port });
                    resolve({ port, host, protocol: 'http', url, provider: 'fastify' })
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description stop server 
     */
    stop() {
        if (this.web?.close instanceof Function) {
            this.web.close();
        }
    }

    onError(callback) {
        callback instanceof Function && this.web.setErrorHandler((error, req, res) => callback(error, new Request(req), new Response(res), null));
    }

    onRequest(callback) {
        callback instanceof Function && this.web.addHook('onRequest', (req, res, next) => callback(new Request(req), new Response(res), next));
    }

    onResponse(callback) {
        callback instanceof Function && this.web.addHook('onResponse', (req, res, next) => callback(new Request(req), new Response(res), next));
    }

    on404(callback) {
        callback instanceof Function && this.web?.setDefaultRoute((req, res) => callback(new Request(req), new Response(res), null));
    }

    routes(web) {
        return [];
    }
}
module.exports = FastifyServer;