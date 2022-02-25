/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class HttpHandler {

    send(res, code, message) {
        if (!res || !code || res.finished || res.writable !== true) return false;
        try {
            switch (code) {
                case 200:
                    res.write([
                        'HTTP/1.1 200 Connection Established',
                        'Proxy-agent: KSMF'
                    ].join('\r\n'));
                    res.write('\r\n\r\n');
                    break;

                case 400:
                    res.write('HTTP/1.1 400 Bad Request\r\n');
                    res.end('\r\n\r\n');
                    res.destroy();
                    break;

                case 403:
                    res.write('HTTP/1.1 403 Forbidden\r\n');
                    res.end('\r\n\r\n');
                    break;

                case 407:
                    res.write([
                        'HTTP/1.1 407 Proxy Authentication Required',
                        'Proxy-Authenticate: Basic realm="proxy"',
                        'Proxy-Connection: close',
                    ].join('\r\n'));
                    res.end('\r\n\r\n');
                    break;

                case 500:
                    res.end(`HTTP/1.1 500 External Server End\r\n`);
                    res.end('\r\n\r\n');
                    break;

                default:
                    res.end(`HTTP/1.1 500 ${message}\r\n`);
                    res.end('\r\n\r\n');
                    break;
            }
        }
        catch (error) {
            console.log('ERROR', 'HttpHandler', error);
        }
    }
}
module.exports = HttpHandler;