/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		05/03/2023
 * @copyright  	Copyright (c) 2020-2035
 * @license    	GPL
 * @version    	1.0
 **/
const KsCryp = require("kscryp");
class LoggerManager {

    constructor(cfg) {
        this.configure(cfg);
    }

    configure(cfg) {
        this.skip = cfg?.skip || this.skip || new Set("adm");
        this.level = cfg?.level || this.level || {
            none: -1,
            all: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4
        }
        this.excluded = cfg?.excluded || this.excluded || [];
        this.driver = cfg?.driver || this.driver || null;
        this.formater = cfg?.formater instanceof Function ? cfg.formater : this.format;
        (this.driver?.configure instanceof Function) && this.driver.configure(cfg);
        return this;
    }

    /**
     * @description function decorator 
     * @param {Object} obj 
     * @param {String} name 
     * @param {Function} callback 
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
     * @description perform the log format 
     * @param {Object} logItem 
     * @param {String} prop 
     * @returns {Object} log entry
     */
    format(logItem, prop, drv) {
        if (typeof logItem === 'object') {
            const level = typeof drv?.level === "object" ? drv.level : {};
            const track = {
                flow: null,
                level: level[prop] ?? level.info,
                ...logItem,
                date: logItem.date || (new Date()).toUTCString(),
            }
            track.flow = track.flow || String(Date.now()) + "00";
            return track;
        }
        return logItem;
    }

    /**
     * @description verify if a value is included in a list
     * @param {String} value 
     * @param {Array|null} [lst] 
     * @returns {Boolean} 
     */
    isExcluded(value, lst = null) {
        lst = lst || this.excluded;
        return lst.some(elm => new RegExp(elm, "g").test(value));
    }

    /**
     * @description track  
     * @param {Object} obj 
     * @returns {Object} logger
     */
    seTrack(obj) {
        const _this = this;
        const format = this.formater || this.format;
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
                            args.map((item) => format(typeof item === 'object' && !Array.isArray(item) ? item : { message: item }, prop, _this)),
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
    seTrackInbound(obj, action = "trackInbound") {
        const _this = this;
        this.skip.add(action);
        Reflect.set(obj, action, () => {
            return (req, res, next) => {
                req.flow = req.flow || this.getFlowId();
                if (!this.isExcluded(req.path)) {
                    obj.debug({
                        flow: req.flow,
                        level: _this.level.debug,
                        src: "KsMf:Logger:Track:Request",
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
                        src: "KsMf:Logger:Track:Redirect",
                        data
                    }));
                    this.wrap(res, "send", (data) => obj?.debug && obj.debug({
                        flow: req.flow,
                        level: _this.level.debug,
                        src: "KsMf:Logger:Track:Response",
                        data: KsCryp.decode(data, "json")
                    }));
                    this.wrap(res, "write", (data) => obj?.debug && obj.debug({
                        flow: req.flow,
                        level: _this.level.debug,
                        src: "KsMf:Logger:Track:Response",
                        data: KsCryp.decode(data, "json")
                    }));
                    this.wrap(res, "end", function (chunk, encoding) {
                        const location = res?.getHeader && res.getHeader("Location");
                        location && obj?.debug && obj.debug({
                            flow: req.flow,
                            level: _this.level.debug,
                            src: "KsMf:Logger:Track:Redirect",
                            data: { location, chunk, encoding }
                        })
                    });
                }
                next instanceof Function && next();
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
    seTrackOutbound(obj, action = "trackOutbound") {
        const _this = this;
        this.skip.add(action);
        Reflect.set(obj, action, () => {
            const outboundTrack = (opt) => (!opt?.path || !this.isExcluded(opt.path)) && obj?.info && obj.info({
                flow: opt.flow || _this.getFlowId(),
                level: _this.level.info,
                src: "KsMf:Logger:Track:Outbound",
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
            this.seTrackInbound(obj);
            this.seTrackOutbound(obj);
            const logger = this.seTrack(obj);
            logger.adm = this;
            return logger;
        }
        catch (error) {
            console.log({ src: "KsMf:Logger:build", error });
        }
    }
}
module.exports = LoggerManager;
