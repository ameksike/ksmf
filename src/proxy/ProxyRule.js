class ProxyRule {

    /**
     * @description ACL rule-based verification method
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} inf 
     * @returns {Boolean} [false for deny or true for allow]
     */
    verify(req, res, inf) {
        if (!inf?.security?.acl) {
            return true;
        }
        if (!inf.security.acl.strategy || inf.security.acl.strategy === 'deny') {
            return this.deny(req, res, inf);
        } else {
            return this.allow(req, res, inf);
        }
    }

    /**
     * @description Apply the strategy: Allow First 
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} inf 
     * @returns {Boolean} [false for deny or true for allow]
     */
    allow(req, res, inf) {
        if (!inf?.security?.acl?.deny) {
            return true;
        }
        return !this.checkScope(inf.security.acl.deny, inf.origin, inf.destination);
    }

    /**
     * @description Apply the strategy: Deny First
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} inf 
     * @returns {Boolean} [false for deny or true for allow]
     */
    deny(req, res, inf) {
        if (!inf?.security?.acl?.allow) {
            return false;
        }
        return this.checkScope(inf.security.acl.allow, inf.origin, inf.destination);
    }

    /**
     * @description Check an acl scope for origin on destination
     * @param {Object} scope 
     * @param {Object} origin 
     * @param {Object} destination 
     * @returns {Boolean}
     */
    checkScope(scope, origin, destination) {
        // ... scope user
        return !!(this.checkOrigin(scope.user, origin.user.username, destination));
    }

    /**
     * @description Check origin target from scope on destination
     * @param {String} origin [<username>|<ip>]
     * @param {Object} destination 
     * @param {Object} scope ACL scope
     * @returns {Array} 
     */
    checkOrigin(scope, origin, destination) {
        if (!origin || !scope || !destination)
            return null;
        for (let i in destination) {
            const acl = this.getAcl(scope, origin, i);
            if (this.check(destination[i], acl)) {
                return null;
            }
        }
        return null;
    }

    /**
     * @description Get ACL for especific origin on destination, Ex: scope[origin][destination] ==> scope['gest']['url']
     * @param {String} origin origin target [<username>|<ip>]
     * @param {String} destination key destination for acl [url|ip|port] 
     * @param {Object} scope ACL scope
     * @returns {Array} 
     */
    getAcl(scope, origin, destination = "url") {
        if (!scope) return [];
        const aclTarget = scope[origin] && scope[origin][destination] ? scope[origin][destination] : [];
        const aclAll = scope['*'] && scope['*'][destination] ? scope['*'][destination] : [];
        return aclAll.concat(aclTarget);
    }

    /**
     * @description check value in a list of regular expresions 
     * @param {Array} acl 
     * @param {String} value 
     * @returns {Boolean}
     */
    check(value, acl) {
        if (!acl || !value || acl.length < 1) return false;
        for (let i in acl) {
            const rex = new RegExp(acl[i]);
            if (rex?.test(value)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = ProxyRule;