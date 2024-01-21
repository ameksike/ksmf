/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		15/11/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * @dependencies AppWEB, HttpHandler
 **/
const http = require('http');
const AppWEB = require('./AppWEB');

class AppRTA {

    constructor(path) {
        this.app = new AppWEB(path);
        this.sockets = {};
    }

    /**
     * @description initialize server proxy app 
     */
    init() {
        try {
            this.app.event.add(this, 'onLoadModule', "ksmf");
            this.app.init();
        } catch (error) {
            this.app.setError(error);
        }
        return this;
    }

    /**
     * @description on load module
     * @param {Object} mod 
     * @param {String} [name] 
     * @param {String} [path] 
     */
    onLoadModule(mod, name, path) {
        this.app.cfg.srv.channel = this.app.cfg.srv.channel || [];
        if (mod.channels) {
            this.app.cfg.srv.channel = this.app.cfg.srv.channel.concat(mod.channels);
        }
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
        const SocketIO = require("socket.io");
        const server = http.createServer(this.app.web);
        this.wss = new SocketIO.Server(server);
        this.initConnection();
        const listener = server.listen(this.app.cfg.srv.port, (err) => {
            if (err) {
                return this.app.setError(err);
            }
            const info = listener.address();
            this.app.setLog('INFO', { server: 'on', host: info.address, port: info.port });
        });
        server.on('error', async (req, res) => {
            //this.app.setError(err);
        });
        this.server = server;
        return listener;
    }

    initConnection() {
        const self = this;
        const channels = this.app.cfg.srv.channel;
        this.wss.on('connection', (wsc) => {
            self.initChannels(wsc, channels);
            self.sockets[wsc.id] = wsc;
            wsc.on('disconnect', () => {
                delete self.sockets[wsc.id];
            });
        });

        this.wss.use(async (socket, next) => {
            if (await self.initAuth(socket, self.wss)) {
                next();
            }
        });
    }

    /**
     * @description initialize channels configurations by client
     * @param {Array} list 
     */
    initChannels(wsc, list) {
        if (!list) return;
        const self = this;
        for (let i in list) {
            const channel = list[i];
            wsc.on(channel.route, (body) => {
                channel.path = channel.path || 'controller';
                channel.name = channel.name || channel.controller;
                const controller = self.app.helper.get(channel);
                if (!controller || !controller[channel.action]) {
                    self.app.setError(`404 on '${channel.module}:${channel.controller}:${channel.action}'`, wsc, self.wss);
                } else {
                    controller[channel.action]({ body, ...wsc }, self.wss);
                }
            });
        }
    }


    /**
     * @description Run authentication handler and get if is valid request or not 
     * @param {Object} req 
     * @param {Object} res 
     * @returns {Boolean}
     */
    async initAuth(req, res) {
        const srvAuth = this.app.helper.get('auth');
        if (!srvAuth || !srvAuth.verify instanceof Function) {
            return true;
        }
        return await srvAuth.verify(req, res);
    }
}

module.exports = AppRTA;