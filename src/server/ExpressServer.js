/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 */
const express = require('express');
const cookieParser = require('cookie-parser');

const https = require('https');

class ExpressServer {

    /**
     * @type {String}
     */
    name = 'express';

    /**
     * @type {Object|null}
     */
    web = null;

    /**
     * @type {Object|null}
     */
    drv = null;

    /**
     * @description configure the web server
     * @param {Object} [payload]
     * @param {Object} [payload.web] 
     * @param {Boolean} [payload.cookie] 
     * @returns {ExpressServer} self
     */
    configure(payload) {
        this.web = payload?.web || express();
        this.drv = express;

        //... Allow cookie Parser
        payload?.cookie && this.use(cookieParser());

        //... Allow body Parser
        this.use(express.urlencoded({ extended: true }));

        return this;
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
        let { route, middlewares, handler, method } = payload;
        try {
            if (!this.web) {
                return null;
            }
            let action = this.web[method];
            if (!action || !handler || !(handler instanceof Function)) {
                return null;
            }
            middlewares = (Array.isArray(middlewares) ? middlewares : [middlewares]) || [];
            return action.apply(this.web, [route, ...middlewares, handler]);
        }
        catch (_) {
            return null;
        }
    }

    /**
     * @description add routes
     */
    add(...arg) {
        this.web?.use(...arg);
    }

    /**
     * @description alias to use action
     */
    use(...arg) {
        this.web?.use(...arg);
    }

    /**
     * @description HTTP get
     */
    get(...arg) {
        this.web?.get(...arg);
    }

    /**
     * @description HTTP POST
     */
    post(...arg) {
        this.web?.post(...arg);
    }

    /**
     * @description HTTP put
     */
    put(...arg) {
        this.web?.put(...arg);
    }

    /**
     * @description HTTP delete
     */
    delete(...arg) {
        this.web?.delete(...arg);
    }

    /**
     * @description HTTP patch
     */
    patch(...arg) {
        this.web?.patch(...arg);
    }

    /**
     * @description HTTP options
     */
    options(...arg) {
        this.web?.options(...arg);
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
        return new Promise((resolve, reject) => {
            try {
                if (protocol === 'https' && key && cert) {
                    https.createServer({ key, cert }, app).listen(port, () => resolve({ port, host, protocol: 'https' }));
                } else {
                    app.listen(port, () => resolve({ port, host, protocol: 'http', url: `${protocol}://${host}:${port}`, provider: 'express' }));
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
        callback instanceof Function && this.web.use((error, req, res, next) => callback(error, req, res, next));
    }

    onRequest(callback) {
        callback instanceof Function && this.web.use((req, res, next) => callback(req, res, next));
    }

    onResponse(callback) {
        callback instanceof Function && this.web.use((req, res, next) => callback(req, res, next));
    }

    on404(callback) {
        callback instanceof Function && this.web?.use('*', (req, res, next) => callback(req, res, next));
    }

    /**
     * @description get list of available routes
     * @param {Object} web 
     * @returns {Array} list
     */
    routes(web = null) {
        web = web || this.web;
        const list = [];
        const epss = [];
        function print(path, layer) {
            if (layer.route) {
                layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
            } else if (layer.name === 'router' && layer.handle.stack) {
                layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
            } else if (layer.method) {
                const endpoint = `${layer.method.toUpperCase()} ${path.concat(split(layer.regexp)).filter(Boolean).join('/')}`;
                if (epss.indexOf(endpoint) === -1) {
                    epss.push(endpoint);
                    list.push([layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join('/')]);
                }
            }
        }
        function split(thing) {
            if (typeof thing === 'string') {
                return thing.split('/')
            } else if (thing.fast_slash) {
                return ''
            } else {
                let match = thing.toString()
                    .replace('\\/?', '')
                    .replace('(?=\\/|$)', '$')
                    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
                return match ?
                    match[1].replace(/\\(.)/g, '$1').split('/') :
                    '<complex:' + thing.toString() + '>'
            }
        }
        web?._router?.stack?.forEach(print.bind(null, []));
        return list;
    }

    register(plugin, options) {
        return this.web?.register instanceof Function && this.web.register(plugin, options);
    }
}
module.exports = ExpressServer;