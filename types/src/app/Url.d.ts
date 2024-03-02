export = UrlUtil;
declare class UrlUtil {
    static "__#6@#instance": any;
    static self(): any;
    /**
     * @description Convert an url string to an object
     * @param {String} url
     * @returns {Object} URL data
     */
    parse(url: string, req: any): any;
    /**
     * @description Get if it is a valid URL
     * @param {String} str
     * @returns {Boolean}
     */
    isValid(str: string): boolean;
    /**
     * @description Get a formatted URL string derived fromurlObject
     * @param {Object} req
     * @param {Object} opt
     * @returns {String}
     */
    format(req: any, opt: any): string;
    /**
     * @description Get a formatted URL string derived req
     * @param {Object} req
     * @returns {String}
     */
    str(req: any): string;
    /**
     * @description Convert as request parameters string
     * @param {Object} req
     * @returns {String} params
     */
    strParam(req: any): string;
    /**
     * @description Convert as request parameters string
     * @param {Object} req
     * @param {String|Object} option
     * @returns {String} params
     */
    param2Str(req: any, option?: string | any): string;
    /**
     * @description Add parameters to an url
     * @param {String} url
     * @param {Object} params
     * @param {Object} [req]
     * @returns {String}
     */
    add(url: string, params: any, req?: any): string;
}
