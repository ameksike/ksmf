/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        15/11/2021
 * @copyright   Copyright (c) 2020-2030
 * @license     GPL
 * @version     1.0
 **/
const http = require('http');
const net = require('net')
const url = require('url')

const AppWEB = require('./WEB');
const HttpHandler = require('../common/Http');

class ProxyApp {
    /**
     * @type {Object|null}
     */
    helper;

    /**
     * @type {Console|null}
     */
    logger;

    constructor(path) {
        this.app = new AppWEB(path)
    }

    /**
     * @description initialize server proxy app 
     */
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

    /**
     * @description start app server 
     */
    start() {
        this.run();
    }

    /**
     * @description stop app server 
     */
    stop() {
        this.app.stop();
    }

    /**
     * @description run app server 
     */
    run() {
        if (!this.app.web) {
            this.init();
        }
        const server = http.createServer(this.app.web);
        const listener = server.listen(this.app.cfg.srv.port, (err) => {
            if (err) {
                return this.app.setError(err);
            }
            const info = /** @type {{ address: string; family: string; port: number; }} */ listener.address();
            this.app?.emit('onStart', [{ server: 'on', host: typeof info === "object" && info.address, port: typeof info === "object" && info.port }, this]);
        });
        server.on('connect', async (req, res, head) => {
            //... Only for HTTP/1.1 CONNECT method
            this.inf = this.initInfo(req, res, head);
            this.app.emit('onConnectStart', [req, res, this.inf]);
            this.inf.status = this.inf.status && await this.initAuth(req, res);
            this.inf.status = this.inf.status && await this.initRules(req, res);
            this.app?.emit('onConnectEnd', [req, res, { state: this.inf.status ? 'ALLOW' : 'DENY', url: this.inf.destination.url, ...this.inf.origin }, this]);
            if (this.inf.status) {
                this.pipe(req, res, this);
            }
        });
        return listener;
    }

    /**
     * @description Get request information
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} head 
     * @returns {Object}
     */
    initInfo(req, res, head) {
        const to = url.parse(`//${req.url}`, false, true);
        const token = req.headers['proxy-authorization'];
        return {
            status: true,
            method: req.method,
            origin: {
                token,
                user: { username: 'anonymous' },
                agent: req.headers['user-agent'],
                host: res.remoteAddress,
                port: res.remotePort
            },
            destination: {
                url: req.url,
                ...to
            },
            security: this.app.cfg.srv.security
        };

    }

    /**
     * @description Run rules handler and get if is valid request or not 
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Promise<boolean>}
     */
    async initRules(req, res) {
        const srvRules = this.app.helper.get('rule');
        if (!(srvRules?.verify instanceof Function)) {
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

    /**
     * @description Run authentication handler and get if is valid request or not 
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Promise<boolean>}
     */
    async initAuth(req, res) {
        const srvAuth = this.app.helper.get('auth');
        if (!(srvAuth?.verify instanceof Function)) {
            return true;
        }
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
        this.inf.origin.user = res.user;
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

module.exports = ProxyApp;