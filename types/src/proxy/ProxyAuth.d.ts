export = ProxyAuth;
declare class ProxyAuth {
    /**
     * @description Get a valid user acount or null
     * @param {Object} req
     * @param {Object} res
     * @param {Object} inf
     * @returns {OBJECT|Null} User { username: STRING; name: STRING; }
     */
    verify(req: any, res: any, inf: any): OBJECT | null;
    /**
     * @description Basic token decode: base64(username:password)
     * @param {String} token
     * @returns {Object} Token { username: STRING; password: STRING; }
     */
    getToken(token: string): any;
    /**
     * @description Get a valid user acount or null
     * @param {Object} token
     * @param {Object} inf
     * @returns {Object|null} User { username: STRING; name: STRING; }
     */
    getUser(token: any, inf: any): any | null;
    /**
     * @description get a password ready to compare
     * @param {String} pass
     * @returns {String} pass
     */
    getPassword(pass: string): string;
}
