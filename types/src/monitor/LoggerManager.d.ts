export = LoggerManager;
declare class LoggerManager {
    constructor(cfg: any);
    configure(cfg: any): this;
    skip: any;
    level: any;
    excluded: any;
    driver: any;
    formater: any;
    /**
     * @description function decorator
     * @param {Object} obj
     * @param {String} name
     * @param {Function} callback
     * @param {String} tag
     * @returns {Object} scope
     */
    wrap(obj: any, name: string, callback: Function): any;
    /**
     * @description get flow id
     * @returns {String} id
     */
    getFlowId(): string;
    /**
     * @description perform the log format
     * @param {Object} logItem
     * @param {String} prop
     * @returns {Object} log entry
     */
    format(logItem: any, prop: string, drv: any): any;
    /**
     * @description verify if a value is included in a list
     * @param {String} value
     * @param {Array} lst
     * @returns {Boolean}
     */
    isExcluded(value: string, lst: any[]): boolean;
    /**
     * @description track
     * @param {Object} obj
     * @returns {Object} logger
     */
    seTrack(obj: any): any;
    /**
     * @description track inbound
     * @param {Object} obj
     * @param {String} action
     * @returns {Object} logger
     */
    seTrackInbound(obj: any, action?: string): any;
    /**
     * @description track outbound
     * @param {Object} obj
     * @param {String} action
     * @returns {Object} logger
     */
    seTrackOutbound(obj: any, action?: string): any;
    /**
     * @description Intercept logger functions calls and format the parameters
     * @param {Object} obj
     * @returns {Object}
     */
    build(obj?: any): any;
}
