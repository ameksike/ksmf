/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
class ErrorHandler {

    /**
     * @description Set options on Initialize Configuration Event 
     * @param {OBJECT} cfg 
     */
    onInitConfig(cfg) {
        this.logger = this.helper?.get("logger");
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
        this.logger?.error({
            src: "KSMF:Monitor:onUncaughtException",
            data: { error: { message: error?.message || error, stack: error?.stack }, origin }
        });
    }

    onUncaughtExceptionMonitor(error, origin) {
        this.logger?.error({
            src: "KSMF:Monitor:onUncaughtExceptionMonitor",
            data: { error: { message: error?.message || error, stack: error?.stack }, origin }
        });
    }

    onUnhandledRejection(reason, promise) {
        this.logger?.error({
            src: "KSMF:Monitor:onUnhandledRejection",
            data: { reason: { message: reason?.message || reason, stack: reason?.stack }, promise }
        });
    }

    onWarning(warning) {
        this.logger?.warn({
            src: "KSMF:Monitor:onWarning",
            data: warning
        });
    }

    onSigInt() {
        this.logger?.info({
            src: "KSMF:Monitor:onSigInt",
            message: 'Received SIGINT. Press Control-D to exit.'
        });
        process.exit(0);
    }

    onSigTerm(signal) {
        this.logger?.info({
            src: "KSMF:Monitor:onSigTerm",
            message: 'Received signal.',
            data: { signal }
        });
    }

    onSigExit(code) {
        this.logger?.error({
            src: "KSMF:Monitor:onSigExit",
            message: 'Received exit signal',
            data: { code }
        });
    }

    onSigBeforeExit(code) {
        this.logger?.warn({
            src: "KSMF:Monitor:onSigBeforeExit",
            message: 'Received exit signal.',
            data: { code }
        });
    }
}

module.exports = ErrorHandler;