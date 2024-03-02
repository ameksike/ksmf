export = ExpressServer;
declare class ExpressServer {
    /**
     * @type {String}
     */
    name: string;
    /**
     * @type {Object|null}
     */
    web: any | null;
    /**
     * @type {Object|null}
     */
    drv: any | null;
    /**
     * @description configure the web server
     * @param {Object} [payload]
     * @param {Object} [payload.web]
     * @param {Boolean} [payload.cookie]
     * @returns {ExpressServer} self
     */
    configure(payload?: {
        web?: any;
        cookie?: boolean;
    }): ExpressServer;
    /**
     * @description publish static files
     * @param {String} url
     * @param {String} path
     */
    publish(url: string, path: string): void;
    /**
     * @description delete routes
     * @param {String|Array<String>} value
     * @param {Function} check
     * @returns {Boolean}
     */
    del(value: string | Array<string>, check?: Function): boolean;
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
    set(payload: any): any;
    /**
     * @description add routes
     */
    add(...arg: any[]): void;
    /**
     * @description alias to use action
     */
    use(...arg: any[]): void;
    /**
     * @description HTTP get
     */
    get(...arg: any[]): void;
    /**
     * @description HTTP POST
     */
    post(...arg: any[]): void;
    /**
     * @description HTTP put
     */
    put(...arg: any[]): void;
    /**
     * @description HTTP delete
     */
    delete(...arg: any[]): void;
    /**
     * @description HTTP patch
     */
    patch(...arg: any[]): void;
    /**
     * @description HTTP options
     */
    options(...arg: any[]): void;
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
    /**
     * @description stop server
     */
    stop(): void;
    onError(callback: any): void;
    onRequest(callback: any): void;
    onResponse(callback: any): void;
    on404(callback: any): void;
    /**
     * @description get list of available routes
     * @param {Object} web
     * @returns {Array} list
     */
    routes(web?: any): any[];
    register(plugin: any, options: any): any;
}
