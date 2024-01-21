/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
class HttpHandler {
    /**
     * initialize each controller response by http code
     */
    constructor() {
        this.ation = {
            200: (res) => {
                res.write([
                    'HTTP/1.1 200 Connection Established',
                    'Proxy-agent: KSMF'
                ].join('\r\n'));
                res.write('\r\n\r\n');
            },
            400: (res) => {
                res.write('HTTP/1.1 400 Bad Request\r\n');
                res.end('\r\n\r\n');
                res.destroy();
            },
            403: (res) => {
                res.write('HTTP/1.1 403 Forbidden\r\n');
                res.end('\r\n\r\n');
            },
            407: (res) => {
                res.write([
                    'HTTP/1.1 407 Proxy Authentication Required',
                    'Proxy-Authenticate: Basic realm="!Ksike Proxy!"',
                    'Proxy-Connection: close',
                ].join('\r\n'));
                res.end('\r\n\r\n');
            },
            500: (res) => {
                res.end(`HTTP/1.1 500 External Server End\r\n`);
                res.end('\r\n\r\n');
            },
            custom: (res, message) => {
                res.end(`HTTP/1.1 500 ${message}\r\n`);
                res.end('\r\n\r\n');
            }
        }
    }

    /**
     * @description safely http response 
     * @param {Object} res 
     * @param {String} code 
     * @param {String} message 
     */
    send(res, code, message) {
        if (!res || !code || res.finished || res.writable !== true) return false;
        try {
            if (this.ation[code]) {
                this.ation[code](res, message);
            }
        }
        catch (error) {
            console.log('[ERROR]', 'HttpHandler', error);
        }
    }
}
module.exports = HttpHandler;