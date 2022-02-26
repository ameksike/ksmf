class ProxyAuth {

    /**
     * @description Get a valid user acount or null
     * @param {OBJECT} req 
     * @param {OBJECT} res 
     * @param {OBJECT} inf 
     * @returns {OBJECT|Null} User { username: STRING; name: STRING; } 
     */
    verify(req, res, inf) {
        if (!inf || !inf.security || !inf.origin || !inf.origin.token) {
            return null;
        }
        const token = this.getToken(inf.origin.token);
        return this.getUser(token, inf);
    }

    /**
     * @description Basic token decode: base64(username:password)
     * @param {STRING} token 
     * @returns {OBJECT} Token { username: STRING; password: STRING; }
     */
    getToken(token) {
        if (!token) return null;
        let bearer = token.split(' ');
        if (!bearer || !bearer instanceof Array) {
            return null;
        }
        bearer = Buffer.from(bearer[1], 'base64').toString();
        if (!bearer || !bearer instanceof Array) {
            return null;
        }
        bearer = bearer.split(':');
        return {
            username: bearer[0],
            password: bearer[1]
        }
    }

    /**
     * @description Get a valid user acount or null
     * @param {OBJECT} token 
     * @param {OBJECT} inf 
     * @returns {OBJECT|Null} User { username: STRING; name: STRING; }
     */
    getUser(token, inf) {
        if (!token || !inf || !inf.security || !inf.security.usr)
            return null;
        const users = inf.security.usr;
        const account = users[token.username];
        if (!account)
            return null;
        if (account.password !== this.getPassword(token.password))
            return null;
        const user = Object.assign({ username: token.username }, account);
        delete user['password'];
        return user;
    }

    /**
     * @description get a password ready to compare
     * @param {STRING} pass 
     * @returns {STRING}
     */
    getPassword(pass) {
        return pass;
    }
}

module.exports = ProxyAuth;