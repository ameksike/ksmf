export = ServerExpress;
declare class ServerExpress {
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
     * @returns {ServerExpress} self
     */
    configure(payload?: {
        web?: any;
    }): ServerExpress;
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
     * @param {Object} payload
     * @param {Number} [payload.port]
     * @param {String} [payload.key]
     * @param {String} [payload.cert]
     * @param {Boolean} [payload.secure]
     * @param {Object} [payload.app]
     * @param {Function} [payload.callback]
     */
    start(payload: {
        port?: number;
        key?: string;
        cert?: string;
        secure?: boolean;
        app?: any;
        callback?: Function;
    }): void;
    /**
     * @description stop server
     */
    stop(): void;
}
