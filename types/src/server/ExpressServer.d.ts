export = ExpressServer;
declare class ExpressServer extends BaseServer {
    /**
     * @description configure the web server
     * @param {Object} [payload]
     * @param {Object} [payload.web]
     * @param {Boolean} [payload.cookie]
     * @returns {Promise<ExpressServer>} self
     */
    configure(payload?: {
        web?: any;
        cookie?: boolean;
    }): Promise<ExpressServer>;
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
    start(payload?: {
        port?: number;
        key?: string;
        cert?: string;
        host?: string;
        protocol?: string;
        secure?: boolean;
        app?: any;
        callback?: Function;
    }): Promise<any>;
}
import BaseServer = require("./BaseServer");
