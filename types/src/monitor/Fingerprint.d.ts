export = Fingerprint;
declare class Fingerprint {
    constructor(cfg?: any);
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {*}
     */
    driver: any;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @type {Array<(req: Request, res: Response, next: Function) => void>}
     */
    middleware: ((req: Request, res: Response, next: Function) => void)[];
    /**
     * @description configure the Fingerprint lib
     * @param {Object} cfg
     * @param {Array} [cfg.middleware]
     * @param {Console} [cfg.logger]
     * @returns {Fingerprint} self
     */
    configure(cfg: {
        middleware?: any[];
        logger?: Console;
    }): Fingerprint;
    /**
     * @description Set options on Initialize Configuration Event
     * @param {Object} cfg
     */
    onInitConfig(cfg: any): void;
    /**
     * @description activate the Fingerprint detection
     * @param {Object} app
     */
    init(app: any): void;
}
