/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        07/03/2020
 * @copyright   Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
class ErrorHandler {

    /**
     * @type {Object|null}
     */
    helper = null;

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @type {Object|null}
     */
    app = null;

    constructor(cfg) {
        this.configure(cfg);
    }

    configure(cfg) {
        this.logger = cfg?.logger || this.logger;
        this.app = cfg?.app || this.app;
    }

    /**
     * @description Set options on Initialize Configuration Event 
     * @param {Object} cfg 
     * @param {Object} cfg 
     */
    async onInitConfig(cfg, app) {
        this.logger = await this.helper?.get("logger") || this.logger;
        this.app = app || await this.helper?.get("app") || this.app;
        this.init();
    }

    init() {
        process.on('uncaughtException', (error, origin) => this.onUncaughtException(error, origin));
        process.on('uncaughtExceptionMonitor', (error, origin) => this.onUncaughtExceptionMonitor(error, origin));
        process.on('unhandledRejection', (reason, promise) => this.onUnhandledRejection(reason, promise));
        process.on('warning', (warning) => this.onWarning(warning));
        process.on('SIGINT', () => this.onSigInt());
        process.on('SIGTERM', (signal) => this.onSigTerm(signal));
        process.on('exit', (code) => this.onSigExit(code));
        process.on('beforeExit', (code) => this.onSigBeforeExit(code));
    }

    onUncaughtException(error, origin) {
        const data = { error: { message: error?.message || error, stack: error?.stack }, origin };
        this.logger?.error({ src: "KSMF:Monitor:onUncaughtException", data });
        this.app?.emit('onUncaughtException', [data, this.app]);
    }

    onUncaughtExceptionMonitor(error, origin) {
        const data = { error: { message: error?.message || error, stack: error?.stack }, origin };
        this.logger?.error({ src: "KSMF:Monitor:onUncaughtExceptionMonitor", data });
        this.app?.emit('onUncaughtExceptionMonitor', [data, this.app]);
    }

    onUnhandledRejection(reason, promise) {
        const data = { error: { message: reason?.message || reason, stack: reason?.stack }, promise }
        this.logger?.error({ src: "KSMF:Monitor:onUnhandledRejection", data });
        this.app?.emit('onUnhandledRejection', [data, this.app]);
    }

    onWarning(warning) {
        this.logger?.warn({ src: "KSMF:Monitor:onWarning", data: warning });
        this.app?.emit('onWarning', [warning, this.app]);
    }

    onSigInt() {
        const data = { message: 'Received SIGINT. Press Control-D to exit.' }
        this.logger?.info({ src: "KSMF:Monitor:onSigInt", data });
        this.app?.emit('onSigInt', [data, this.app]);
        process.exit(0);
    }

    onSigTerm(signal) {
        const data = { message: 'Received signal.', signal };
        this.logger?.info({ src: "KSMF:Monitor:onSigTerm", data });
        this.app?.emit('onSigTerm', [data, this.app]);
    }

    onSigExit(code) {
        const data = { message: 'Received exit signal', code }
        this.logger?.error({ src: "KSMF:Monitor:onSigExit", data });
        this.app?.emit('onSigExit', [data, this.app]);
    }

    onSigBeforeExit(code) {
        const data = { message: 'Received exit signal.', code }
        this.logger?.warn({ src: "KSMF:Monitor:onSigBeforeExit", data });
        this.app?.emit('onSigBeforeExit', [data, this.app]);
    }
}

module.exports = ErrorHandler;