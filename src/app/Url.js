/**
 * @description Utility for URL manipulation 
 * @module utils/Url 
 */
const _url = require("url");
class UrlUtil {

    /**
     * @description Convert an url string to an object 
     * @param {String} url 
     * @returns {Object} URL data 
     */
    parse(url, req) {
        if (!this.isValid(url) && req) {
            url = this.format(req, { pathname: url });
        }
        try {
            return url && new _url.URL(url);
        }
        catch (error) {
            return null;
        }
    }

    /**
     * @description Get if it is a valid URL 
     * @param {String} str 
     * @returns {Boolean} 
     */
    isValid(str) {
        try {
            return Boolean(new URL(str));
        }
        catch (e) {
            return false;
        }
    }

    /**
     * @description Get a formatted URL string derived fromurlObject
     * @param {Object} req 
     * @param {Object} opt 
     * @returns {String}
     */
    format(req, opt) {
        let hosh = ((req.get && req.get('host')) || '').split(':');
        let host = opt?.host || req.host || hosh[0];
        let port = opt?.port || req.port || hosh[1];
        host = port && parseInt(port) !== 80 ? host + ':' + port : host;
        const opts = {
            ...req,
            host,
            port,
            pathname: opt?.pathname || req.pathname,
            protocol: opt?.protocol || req.protocol || 'http'
        };
        return _url.format(opts);
    }

    /**
     * @description Get a formatted URL string derived req
     * @param {Object} req 
     * @returns {String}
     */
    str(req) {
        return `${req.protocol}://${(req.get && req.get('host') || req.host)}`;
    }

    /**
     * @description Convert as request parameters string  
     * @param {Object} req 
     * @returns {String} params 
     */
    strParam(req) {
        if (!req) {
            return "";
        }
        let tmp = "";
        for (let i in req) {
            let sep = !tmp ? "&" : "";
            tmp += sep + i + "=" + req[i];
        }
        return tmp;
    }

    /**
     * @description Add parameters to an url
     * @param {String} url 
     * @param {Object} params 
     * @returns {String}
     */
    add(url, params, req) {
        const tmp = url ? this.parse(url, req) : false;
        if (!tmp || !params) {
            return "";
        }
        for (let i in params) {
            params[i] && tmp.searchParams.append(i, params[i]);
        }
        return tmp.href;
    }

    static #instance;
    static self() {
        if (!this.#instance) {
            this.#instance = new UrlUtil();
        }
        return this.#instance;
    }
}

module.exports = UrlUtil;