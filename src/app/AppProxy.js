/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		15/11/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @dependencies AppWEB
 * */
const http = require('http');
const net = require('net')
const url = require('url')
const AppWEB = require('./AppWEB');
const HttpHandler = require('./HttpHandler');

class AppProxy {

    constructor(path) {
        this.app = new AppWEB(path)
    }

    init() {
        try {
            this.app.init();
            if (!this.app.helper.get('http')) {
                this.app.helper.set(new HttpHandler(), 'http');
            }
        } catch (error) {
            this.app.setError(error);
        }
        return this;
    }

    start() {
        this.run();
    }

    stop() {
        this.app.stop();
    }

    run() {
        if (!this.app.web) {
            this.init();
        }
        const server = http.createServer(this.app.web);
        const listener = server.listen(this.app.cfg.srv.port, (err) => {
            if (err) {
                return this.app.setError(err);
            }
            const info = listener.address();
            this.app.setLog('INFO', { server: 'on', host: info.address, port: info.port });
        });
        server.on('connect', async (req, res, head) => {
            //... Only for HTTP/1.1 CONNECT method
            this.inf = this.initInfo(req, res, head);
            this.app.emit('onConnect', 'ksmf', [req, res, this.inf]);
            this.inf.status = this.inf.status && await this.initAuth(req, res);
            this.inf.status = this.inf.status && await this.initRules(req, res);
            if (this.inf.status) {
                this.pipe(req, res, this);
            }
        });
        return listener;
    }

    initInfo(req, res, head) {
        const destination = url.parse(`//${req.url}`, false, true);
        return {
            status: true,
            method: req.method,
            url: req.url,
            user: { username: 'gest' },
            origin: {
                'agent': req.headers['user-agent'],
                'host': res.remoteAddress,
                'port': res.remotePort
            },
            destination
        };

    }

    async initRules(req, res) {
        const srvRules = this.app.helper.get('rules');
        if (!srvRules || !srvRules.verify instanceof Function) {
            return true;
        }
        const verification = await srvRules.verify(req, res, this.inf);
        if (!verification) {
            try {
                this.app.helper.get('http').send(res, 403);
            }
            catch (error) {
                this.app.setError(error);
            }
            return false;
        }
        return true;
    }

    async initAuth(req, res) {
        const srvAuth = this.app.helper.get('auth');
        if (!srvAuth || !srvAuth.verify instanceof Function) {
            return true;
        }
        this.inf.token = req.headers['proxy-authorization'];
        res.user = await srvAuth.verify(req, res, this.inf);
        if (!res.user) {
            try {
                this.app.helper.get('http').send(res, 407);
            }
            catch (error) {
                this.app.setError(error);
            }
            return false;
        }
        this.app.setLog('INFO', { ...this.inf, user: res.user });
        this.inf.user = res.user;
        return true;
    }

    pipe(req, clientSocket, srv) {
        const { port, hostname } = srv.inf.destination;
        if (hostname && port) {
            const serverSocket = net.connect(port, hostname);
            srv.app.emit('onPipe', 'ksmf', [req, clientSocket, serverSocket]);
            const serverErrorHandler = (err) => {
                srv.app.setError(err, req, clientSocket);
                srv.app.helper.get('http').send(clientSocket, 'custom', err.message);
            }
            const serverEndHandler = () => {
                srv.app.setError('External Server End', req, clientSocket);
                srv.app.helper.get('http').send(clientSocket, 500);
            }
            const clientErrorHandler = (err) => {
                srv.app.setError(err, req, clientSocket);
                srv.app.helper.get('http').send(clientSocket, 'custom', err.message);
            }
            const clientEndHandler = () => {
                srv.app.setError('client End Handler', req, clientSocket);
                srv.app.helper.get('http').send(clientSocket, 'custom', 'client_end');
            }
            clientSocket.on('error', clientErrorHandler);
            clientSocket.on('end', clientEndHandler);
            serverSocket.on('error', serverErrorHandler);
            serverSocket.on('end', serverEndHandler);
            serverSocket.on('connect', () => {
                srv.app.helper.get('http').send(clientSocket, 200);
                serverSocket.pipe(clientSocket, { end: false });
                clientSocket.pipe(serverSocket, { end: false });
            })
        } else {
            srv.app.setError('Bad Request', req, clientSocket);
            srv.app.helper.get('http').send(clientSocket, 400);
        }
    }
}

module.exports = AppProxy;