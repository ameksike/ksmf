const ksdp = require("ksdp");
class BaseServer extends ksdp.integration.Dip {

    /**
     * @type {Object|null}
     */
    helper = null;

    /**
     * @type {Object|null}
     */
    option = null;

    /**
     * @type {Object|null}
     */
    cookie = null;

    /**
     * @type {Object|null}
     */
    session = null;

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @type {String}
     */
    name = 'base';

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
     * @param {Object} [payload.drv]
     * @param {Object} [payload.logger]
     * @param {Object} [payload.helper]
     * @param {Object} [payload.option]
     * @param {Object} [payload.cookie]
     * @param {Object} [payload.session]
     * @returns {Promise<BaseServer>} self
     */
    configure(payload) {
        this.web = payload?.web || this.web;
        this.drv = payload?.drv || this.drv;
        this.logger = payload?.logger || this.logger;
        this.helper = payload?.helper || this.helper;
        this.option = payload?.option || this.option;
        this.cookie = payload?.cookie || this.cookie;
        this.session = payload?.session || this.session;
        return Promise.resolve(this);
    }

    /**
     * @description add session support
     * @param {Object|null} [session] 
     * @param {Object|null} [web] 
     */
    initSession(session = null, web = null) {
        this.session = session || this.session;
    }

    /**
     * @description add cookie support
     * @param {Object|null} [cookie] 
     * @param {Object|null} [web] 
     */
    initCookie(cookie = null, web = null) {
        this.cookie = cookie || this.cookie;
    }

    /**
     * @description add Fingerprint support
     * @param {Object|null} [config] 
     * @param {Object|null} [web] 
     */
    initFingerprint(config = null, web = null) {
        // ... 
    }
    
    /**
     * @description add cors support
     * @param {Object|null} [config] 
     * @param {Object|null} [web] 
     */
    initCors(config = null, web = null) {
        // ...  
    }

    /**
     * @description publish static files
     * @param {String} url 
     * @param {String} path 
     */
    publish(url, path) {
        //... Allow static files
        url && path && this.drv?.static instanceof Function && this.web?.use(url, this.drv.static(path));
    }

    /**
     * @description delete routes 
     * @param {String|Array<String>} value 
     * @param {Function} check 
     * @returns {Boolean}
     */
    del(value, check = null) {
        return value && check instanceof Function;
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
        return payload;
    }

    /**
     * @description add routes
     */
    add(...arg) {
        this.web?.use(...arg);
    }

    /**
     * @description get list of available routes
     * @param {Object} web 
     * @returns {Array} list
     */
    routes(web = null) {
        // ... 
        return [];
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

    register(plugin, options) {
        return this.web?.register instanceof Function && this.web.register(plugin, options);
    }

    unregister(plugin, options) {
        return this.web?.unregister instanceof Function && this.web.unregister(plugin, options);
    }

    onError(callback) {
        // ... 
    }

    onRequest(callback) {
        // ... 
    }

    onResponse(callback) {
        // ... 
    }

    on404(callback) {
        // ... 
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
        // ... 
    }

    /**
     * @description stop server 
     */
    stop() {
        // ... 
    }
}
module.exports = BaseServer;