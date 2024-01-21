export = ErrorHandler;
/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		07/03/2020
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
declare class ErrorHandler {
    constructor(cfg: any);
    configure(cfg: any): void;
    logger: any;
    /**
     * @description Set options on Initialize Configuration Event
     * @param {Object} cfg
     */
    onInitConfig(cfg: any): void;
    init(): void;
    onUncaughtException(error: any, origin: any): void;
    onUncaughtExceptionMonitor(error: any, origin: any): void;
    onUnhandledRejection(reason: any, promise: any): void;
    onWarning(warning: any): void;
    onSigInt(): void;
    onSigTerm(signal: any): void;
    onSigExit(code: any): void;
    onSigBeforeExit(code: any): void;
}
