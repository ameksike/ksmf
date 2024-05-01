export = ProxyRule;
declare class ProxyRule {
    /**
     * @description ACL rule-based verification method
     * @param {Object} req
     * @param {Object} res
     * @param {Object} inf
     * @returns {Boolean} [false for deny or true for allow]
     */
    verify(req: any, res: any, inf: any): boolean;
    /**
     * @description Apply the strategy: Allow First
     * @param {Object} req
     * @param {Object} res
     * @param {Object} inf
     * @returns {Boolean} [false for deny or true for allow]
     */
    allow(req: any, res: any, inf: any): boolean;
    /**
     * @description Apply the strategy: Deny First
     * @param {Object} req
     * @param {Object} res
     * @param {Object} inf
     * @returns {Boolean} [false for deny or true for allow]
     */
    deny(req: any, res: any, inf: any): boolean;
    /**
     * @description Check an acl scope for origin on destination
     * @param {Object} scope
     * @param {Object} origin
     * @param {Object} destination
     * @returns {Boolean}
     */
    checkScope(scope: any, origin: any, destination: any): boolean;
    /**
     * @description Check origin target from scope on destination
     * @param {String} origin [<username>|<ip>]
     * @param {Object} destination
     * @param {Object} scope ACL scope
     * @returns {Array}
     */
    checkOrigin(scope: any, origin: string, destination: any): any[];
    /**
     * @description Get ACL for especific origin on destination, Ex: scope[origin][destination] ==> scope['gest']['url']
     * @param {String} origin origin target [<username>|<ip>]
     * @param {String} destination key destination for acl [url|ip|port]
     * @param {Object} scope ACL scope
     * @returns {Array}
     */
    getAcl(scope: any, origin: string, destination?: string): any[];
    /**
     * @description check value in a list of regular expresions
     * @param {Array} acl
     * @param {String} value
     * @returns {Boolean}
     */
    check(value: string, acl: any[]): boolean;
}
