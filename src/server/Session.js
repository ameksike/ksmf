/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @requires    ksmf
 */
const ksdp = require('ksdp');
class SessionService extends ksdp.integration.Dip {
    /**
     * @type {Object|null}
     */
    authService = null;

    /**
     * @type {Object|null}
     */
    logger = null;

    /**
     * @type {String}
     */
    sessionKey = "user";

    /**
     * @param {Object} [option]
     * @param {Object} [option.logger] 
     * @param {String} [option.sessionKey] 
     * @param {Object} [option.authService] 
     */
    constructor(option = null) {
        super();
        this.logger = option?.logger || null;
        this.sessionKey = option?.sessionKey || this.sessionKey;
        this.authService = option?.authService || this.authService;
    }

    /**
     * @description initialize the session manager
     * @param {Object} app 
     * @param {Object} option 
     * @returns {SessionService} self
     */
    init(app, option = null) {
        if (app?.initSession instanceof Function) {
            app?.initSession(option)
        }
        if (app?.web?.use instanceof Function && option?.middleware instanceof Function) {
            app.web.use(option.middleware);
        }
        return this;
    }

    /**
     * @description get session config
     * @param {Object} option 
     * @returns {Object} config
     */
    getConfig(option) {
        return {
            resave: option?.resave ?? false,
            saveUninitialized: option?.saveUninitialized ?? true,
            secret: option?.secret || '3v23v23v23v23v23v2',
            cookie: {
                maxAge: option?.maxAge || 24 * 60 * 60 * 1000,
                sameSite: option?.sameSite ?? (option?.https ? 'None' : 'Lax'),
                secure: option?.secure ?? (option?.https ? true : false),
                httpOnly: option?.httpOnly ?? true
            },
            name: option?.name ?? '_ksmf_',
            ...option?.overwrite
        }
    }

    /**
     * @description wrapper to set options on Initialize App Event 
     * @param {Object} server 
     */
    onInitApp(server) {
        this.init(server);
    }

    /**
     * @description get request token 
     * @param {Object} req 
     * @param {Object} [req.headers]
     * @param {String} [req.headers.authorization]
     * @param {Object} [req.query] 
     * @param {String} [req.query.authorization] 
     * @param {String} [req.query.Authorization] 
     * @param {String} [req.query.token] 
     * @param {Object} [req.body] 
     * @param {String} [req.body.token] 
     * @returns {String} token
     */
    getToken(req) {
        const header = req?.headers?.authorization || req?.query?.authorization || req?.query?.Authorization || req?.body?.token || req?.query?.token;
        if (!header) {
            return null;
        }
        const option = (header?.split instanceof Function && header.split(" ")) || [];
        const token = option[option.length - 1];
        return token;
    }

    /**
     * @description get a session user account 
     * @param {Object} req 
     * @param {String} key 
     * @returns {Object} session
     */
    select(req, key = 'user') {
        let acc = req.session && (req.session[key] || req.session.user);
        this.logger?.info({
            flow: req.flow,
            src: "Ksmf:Session:account",
            data: { key, account: acc, session: req.session }
        });
        return acc;
    }

    /**
     * @description create a new user session 
     * @param {Object} req 
     * @param {String} [key] 
     * @param {Object} [payload] 
     * @returns {Object} session account
     */
    create(req, key = 'user', payload = null) {
        if (req.session && payload) {
            req.session[key] = { ...req.session[key], ...payload };
            this.logger?.info({
                flow: req.flow,
                src: "Ksmf:Session:create",
                data: req.session[key]
            });
            return req.session[key];
        } else {
            this.logger?.error({
                flow: req.flow,
                src: "Ksmf:Session:create",
                data: { key, payload, session: req.session }
            });
            return null;
        }
    }

    /**
     * @description update a new user session 
     * @param {Object} req 
     * @param {String} [key] 
     * @param {Object} [payload] 
     * @returns {Object} session account
     */
    update(req, key = 'user', payload = null) {
        return this.create(req, key, payload)
    }

    /**
     * @description save update/create a new user session 
     * @param {Object} req 
     * @param {String} [key] 
     * @param {Object} [payload] 
     * @returns {Object} session account
     */
    save(req, key = 'user', payload = null) {
        return this.create(req, key, payload)
    }

    /**
     * @description remove the user session account 
     * @param {Object} req 
     * @param {String} key 
     * @param {Boolean} full 
     * @returns {Object} account
     */
    remove(req, key = 'user', full = true) {
        if (req?.session) {
            const account = req.session[key];
            delete req.session[key];
            full && req.session?.destroy instanceof Function && req.session.destroy();
            this.logger?.info({
                flow: req.flow,
                src: "Ksmf:Session:remove",
                data: { key, full, account, session: req.session }
            });
            return account;
        } else {
            this.logger?.error({
                flow: req.flow,
                src: "Ksmf:Session:remove",
                data: { key, full, session: req.session }
            });
        }
        return null;
    }

    /**
     * @description check the user session
     * @param {Object} option 
     * @param {Object} [context] 
     * @param {Object} [authService] 
     * @returns {Promise<boolean>} validated
     */
    async check(option, context = null, authService = null) {
        const { key = this.sessionKey, mode } = option || {};
        const { req } = context || {};
        // get session 
        const sess = this.select(req, key) || {};
        sess.access_token = sess.access_token || this.getToken(req);

        if (sess) {
            // register user
            if (!sess?.user && sess?.access_token) {
                authService = authService || this.authService;
                const meta = authService?.parse instanceof Function && await authService.parse(sess.access_token, { flow: req.flow, mode });
                sess.user = meta?.usr || meta?.user;
                sess.exp = meta?.exp;
            }
            // validate session
            const act = Math.floor(new Date().getTime() / 1000);
            if (sess?.exp !== undefined && sess.exp < act) {
                this.logger?.error({
                    flow: req.flow,
                    src: "Ksmf:Session:check",
                    message: "Session expired",
                    data: { key, mode, account: sess?.user, token: sess?.access_token, exp: sess?.exp, date: act }
                });
                this.remove(req, key, false);
                return false;
            }
            // validate user
            if (sess?.user) {
                this.logger?.info({
                    flow: req.flow,
                    src: "Ksmf:Session:check",
                    message: "There is a valid user account",
                    data: sess.user
                });
                return true;
            } else {
                // reject request 
                this.logger?.error({
                    flow: req.flow,
                    src: "Ksmf:Session:check",
                    message: "There is no user account",
                    data: { key, mode, token: sess?.access_token, session: req.session }
                });
            }
        }
        return false;
    }

    /**
     * @description select method alias, get a session user account 
     * @param {Object} req 
     * @param {String} key 
     * @returns {Object} session
     */
    account(req, key = 'user') {
        return this.select(req, key);
    }
}

module.exports = SessionService;