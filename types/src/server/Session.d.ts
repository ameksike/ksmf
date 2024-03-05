export = SessionService;
declare const SessionService_base: typeof import("ksdp/types/src/integration/Dip");
declare class SessionService extends SessionService_base {
    /**
     * @param {Object} [option]
     * @param {Object} [option.logger]
     * @param {String} [option.sessionKey]
     * @param {Object} [option.authService]
     */
    constructor(option?: {
        logger?: any;
        sessionKey?: string;
        authService?: any;
    });
    /**
     * @type {Object|null}
     */
    authService: any | null;
    /**
     * @type {Object|null}
     */
    logger: any | null;
    /**
     * @type {String}
     */
    sessionKey: string;
    /**
     * @description initialize the session manager
     * @param {Object} app
     * @param {Object} option
     * @returns {SessionService} self
     */
    init(app: any, option?: any): SessionService;
    /**
     * @description get session config
     * @param {Object} option
     * @returns {Object} config
     */
    getConfig(option: any): any;
    /**
     * @description wrapper to set options on Initialize App Event
     * @param {Object} web
     */
    onInitApp(web: any): void;
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
    getToken(req: {
        headers?: {
            authorization?: string;
        };
        query?: {
            authorization?: string;
            Authorization?: string;
            token?: string;
        };
        body?: {
            token?: string;
        };
    }): string;
    /**
     * @description get a session user account
     * @param {Object} req
     * @param {String} key
     * @returns {Object} session
     */
    select(req: any, key?: string): any;
    /**
     * @description select method alias, get a session user account
     * @param {Object} req
     * @param {String} key
     * @returns {Object} session
     */
    account(req: any, key?: string): any;
    /**
     * @description check the user session
     * @param {Object} option
     * @param {Object} [context]
     * @param {Object} [authService]
     * @returns {Promise<boolean>} validated
     */
    check(option: any, context?: any, authService?: any): Promise<boolean>;
    /**
     * @description create a new user session
     * @param {Object} req
     * @param {String} [key]
     * @param {Object} [payload]
     * @returns {Object} session account
     */
    create(req: any, key?: string, payload?: any): any;
    /**
     * @description remove the user session account
     * @param {Object} req
     * @param {String} key
     * @param {Boolean} full
     * @returns {Object} account
     */
    remove(req: any, key?: string, full?: boolean): any;
}
