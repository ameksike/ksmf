class ProxyRule {

    /**
     * @description ACL rule-based verification method
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} inf 
     * @returns {BOOLEAN} [false for deny or true for allow]
     */
    verify(req, res, inf) {
        if (!inf || !inf.security || !inf.security.acl) {
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
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} inf 
     * @returns {BOOLEAN} [false for deny or true for allow]
     */
    allow(req, res, inf) {
        if (!inf || !inf.security || !inf.security.acl || !inf.security.acl.deny) {
            return true;
        }
        return !this.checkScope(inf.security.acl.deny, inf.origin, inf.destination);
    }

    /**
     * @description Apply the strategy: Deny First
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} inf 
     * @returns {BOOLEAN} [false for deny or true for allow]
     */
    deny(req, res, inf) {
        if (!inf || !inf.security || !inf.security.acl || !inf.security.acl.allow) {
            return false;
        }
        return this.checkScope(inf.security.acl.allow, inf.origin, inf.destination);
    }

    /**
     * @description Check an acl scope for origin on destination
     * @param {OBJECT} scope 
     * @param {OBJECT} origin 
     * @param {OBJECT} destination 
     * @returns {BOOLEAN}
     */
    checkScope(scope, origin, destination) {
        // ... scope user
        if (this.checkOrigin(scope.user, origin.user.username, destination)) {
            return true;
        }
        // ... scope host
        // ... scope host
        return false;
    }

    /**
     * @description Check origin target from scope on destination
     * @param {STRING} origin [<username>|<ip>]
     * @param {OBJECT} destination 
     * @param {OBJECT} scope ACL scope
     * @returns {ARRAY} 
     */
    checkOrigin(scope, origin, destination) {
        if (!origin || !scope || !destination)
            return false;
        for (let i in destination) {
            const acl = this.getAcl(scope, origin, i);
            if (this.check(destination[i], acl)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description Get ACL for especific origin on destination, Ex: scope[origin][destination] ==> scope['gest']['url']
     * @param {STRING} origin origin target [<username>|<ip>]
     * @param {STRING} destination key destination for acl [url|ip|port] 
     * @param {OBJECT} scope ACL scope
     * @returns {ARRAY} 
     */
    getAcl(scope, origin, destination = "url") {
        if (!scope) return [];
        const aclTarget = scope[origin] && scope[origin][destination] ? scope[origin][destination] : [];
        const aclAll = scope['*'] && scope['*'][destination] ? scope['*'][destination] : [];
        return aclAll.concat(aclTarget);
    }

    /**
     * @description check value in a list of regular expresions 
     * @param {ARRAY} acl 
     * @param {STRING} value 
     * @returns {BOOLEAN}
     */
    check(value, acl) {
        if (!acl || !value || acl.length < 1) return false;
        for (let i in acl) {
            const rex = new RegExp(acl[i]);
            if (rex && rex.test(value)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = ProxyRule;