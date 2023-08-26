/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		05/03/2023
 * @copyright  	Copyright (c) 2020-2035
 * @license    	GPL
 * @version    	1.0
 */
const ksdp = require('ksdp');
class LoggerManager extends ksdp.integration.Dip {

    constructor(cfg) {
        super();
        this.excluded = cfg?.excluded || [];
        this.driver = cfg?.driver || null;
        this.skip = cfg?.skip || new Set("adm");
        this.level = cfg?.level || {
            none: -1,
            all: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4
        }
    }

    /**
     * @description function decorator 
     * @param {Object} obj 
     * @param {String} name 
     * @param {Function} callback 
     * @param {String} tag 
     * @returns {Object} scope
     */
    wrap(obj, name, callback) {
        if (!obj || !obj[name]) {
            return null;
        }
        const method = obj[name];
        if (!method || !(callback instanceof Function)) {
            return obj;
        }
        obj[name] = function () {
            callback.apply(this, arguments);
            return method.apply(this, arguments);
        }
        return obj;
    }

    /**
     * @description get flow id 
     * @returns {String} id
     */
    getFlowId() {
        return String(Date.now()) + String(Math.floor(Math.random() * 100) + 11).slice(-2);
    }

    /**
     * @description 
     * @param {Object} logItem 
     * @param {String} prop 
     * @returns {Object} 
     */
    format(logItem, prop) {
        if (typeof logItem === 'object') {
            return {
                flow: String(Date.now()) + "00",
                level: this.level[prop] ?? this.level.info,
                ...logItem,
                date: logItem.date || (new Date()).toUTCString(),
            }
        }
        return logItem;
    }

    /**
     * @description verify if a value is included in a list
     * @param {String} value 
     * @param {Array} lst 
     * @returns {Boolean} 
     */
    isExcluded(value, lst) {
        lst = lst || this.excluded;
        return lst.some(elm => new RegExp(elm, "g").test(value));
    }

    /**
     * @description track  
     * @param {Object} obj 
     * @returns {Object} logger
     */
    track(obj) {
        const _this = this;
        return new Proxy(obj, {
            get(target, prop, receiver) {
                const method = Reflect.get(target, prop, receiver);
                if (_this.skip.has(prop)) {
                    return typeof method === 'function' ? method.bind(target) : method;
                }
                return method instanceof Function
                    ? (...args) =>
                        method.apply(
                            target,
                            args.map((item) => _this.format(typeof item === 'object' && !Array.isArray(item) ? item : { message: item }, prop)),
                        )
                    : method;
            }
        });
    }

    /**
     * @description track inbound 
     * @param {Object} obj 
     * @param {String} action 
     * @returns {Object} logger
     */
    trackInbound(obj, action = "track") {
        const _this = this;
        this.skip.add(action);
        Reflect.set(obj, action, () => {
            return (req, res, next) => {
                if (!this.isExcluded(req.path)) {
                    req.flow = this.getFlowId();
                    obj.debug({
                        flow: req.flow,
                        level: _this.level.debug,
                        src: "Logger:Track:Request",
                        data: {
                            method: req.method,
                            path: req.path,
                            query: req.query,
                            headers: req.headers,
                            body: req.body
                        }
                    });
                    this.wrap(res, "redirect", (data) => obj?.debug && obj.debug({
                        flow: req.flow,
                        level: _this.level.debug,
                        src: "Logger:Track:Redirect",
                        data
                    }));
                    this.wrap(res, "send", (data) => obj?.debug && obj.debug({
                        flow: req.flow,
                        level: _this.level.debug,
                        src: "Logger:Track:Response",
                        data
                    }));
                    this.wrap(res, "end", function (chunk, encoding) {
                        const location = res?.getHeader && res.getHeader("Location");
                        location && obj?.debug && obj.debug({
                            flow: req.flow,
                            level: _this.level.debug,
                            src: "Logger:Track:Redirect",
                            data: { location, chunk, encoding }
                        })
                    });
                }
                next();
            }
        });
        return obj;
    }

    /**
     * @description track outbound 
     * @param {Object} obj 
     * @param {String} action 
     * @returns {Object} logger
     */
    trackOutbound(obj, action = "trackOutbound") {
        const _this = this;
        this.skip.add(action);
        Reflect.set(obj, action, () => {
            const outboundTrack = (opt) => obj?.info && obj.info({
                flow: _this.getFlowId(),
                level: _this.level.info,
                src: "Logger:Track:Outbound",
                data: typeof (opt) === "object" ? {
                    hostname: opt.hostname,
                    port: opt.port,
                    protocol: opt.protocol,
                    method: opt.method,
                    path: opt.path,
                    query: opt.query,
                    headers: opt.headers,
                    body: opt.body && Object.keys(opt.body)
                } : { url: opt }
            });

            const http = require("http");
            this.wrap(http, "request", outboundTrack);
            this.wrap(http, "get", outboundTrack);

            const https = require("https");
            this.wrap(https, "request", outboundTrack);
            this.wrap(https, "get", outboundTrack);
        });
        return obj;
    }

    /**
     * @description Intercept logger functions calls and format the parameters
     * @param {Object} obj
     * @returns {Object}
     */
    build(obj = null) {
        obj = obj || this.driver;
        try {
            this.trackInbound(obj);
            this.trackOutbound(obj);
            const logger = this.track(obj);
            logger.adm = this;
            return logger;
        }
        catch (error) {
            console.log({ src: "Service:LoggerManager:build", error });
        }
    }
}
module.exports = LoggerManager;
