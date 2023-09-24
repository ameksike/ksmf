/**
 * @description Utility for URL manipulation 
 * @module utils/Url 
 */
const _url = require("url");
class UrlUtil {

    /**
     * @description Convert an url string to an object 
     * @param {String} url 
     * @returns {Object}
     */
    parse(url) {
        return url && new _url.URL(url);
    }

    /**
     * @description Get a formatted URL string derived fromurlObject
     * @param {Object} req 
     * @returns {String}
     */
    format(req) {
        let hosh = ((req.get && req.get('host')) || "").split(":");
        let host = req.host || hosh[0];
        let port = req.port || hosh[1];
        host = port && parseInt(port) !== 80 ? host + ":" + port : host;
        const opts = {
            ...req,
            host,
            port,
            pathname: req.pathname,
            protocol: req.protocol || "http",
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
     * @description Add parameters to an url
     * @param {String} url 
     * @param {Object} params 
     * @returns {String}
     */
    add(url, params) {
        const tmp = url ? this.parse(url) : false;
        if (!tmp || !params) {
            return "";
        }
        for (let i in params) {
            tmp.searchParams.append(i, params[i]);
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