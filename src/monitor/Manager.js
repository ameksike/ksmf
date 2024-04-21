/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        22/04/2020
 * @copyright   Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 **/
class Manager {

    /**
     * @type {Object|null}
     */
    helper;

    /**
     * @type {Console|null}
     */
    logger;

    constructor(cfg) {
        this.helper = null;
        this.logger = null;
        this.startUsage = process?.cpuUsage && process.cpuUsage();
        this.configure(cfg);
    }

    configure(cfg) {
        this.logger = cfg?.logger || this.logger;
    }

    /**
     * @description Set options on Initialize Configuration Event 
     * @param {Object} cfg 
     * @param {Object} app 
     */
    async onInitConfig(cfg, app) {
        this.app = app || await this.helper?.get('app');
        this.app?.subscribe(this, 'onStart');
        this.app?.subscribe(this, 'onError');
    }

    /**
     * @description KsMf Wrapper
     * @param {Object} info 
     */
    async onStart(info = {}) {
        const app = await this.helper?.get('app');
        const logger = await this.helper?.get('logger') || this.logger;
        const routes = app?.server?.routes instanceof Function && app.server.routes();
        logger?.info({
            src: "KSMF:Monitor:onStart",
            message: info?.message,
            data: {
                url: info?.url,
                public: info?.public,
                static: info?.static,
                routes
            }
        });
    }

    /**
     * @description error handler
     * @param {Object} error 
     */
    async onError(error) {
        const logger = await this.helper?.get('logger') || this.logger;
        (logger?.error instanceof Function) && logger?.error({
            src: "KSMF:Monitor:onError",
            message: error?.message || error,
            stack: error?.stack
        });
    }

    /**
     * @description get platform information
     * @returns {Object} info
     */
    info() {
        let cpuUsage = (process.cpuUsage instanceof Function) && process.cpuUsage(this.startUsage);
        let memory = (process.constrainedMemory instanceof Function) && process.constrainedMemory();
        let memuse = (process.memoryUsage instanceof Function) && process.memoryUsage();
        return {
            rsc_memory: memory ?? "none",
            rsc_memory_buffers: memuse?.arrayBuffers ?? "none",
            rsc_memory_external: memuse?.external ?? "none",
            rsc_memory_heap_total: memuse?.heapTotal ?? "none",
            rsc_memory_heap_used: memuse?.heapUsed ?? "none",
            rsc_memory_heap_rss: memuse?.rss ?? "none",
            rsc_cpu_usage_system: cpuUsage?.system ? cpuUsage?.system / 1000000 : "none",
            rsc_cpu_usage_user: cpuUsage?.user ? cpuUsage?.user / 1000000 : "none",
            prd_connected: process.connected ?? "none",
            prd_pid: process.pid ?? "none",
            host_arch: process.config?.variables?.host_arch ?? process.arch ?? "none",
            host_platform: process.platform,
            host_target_arch: process.config?.variables?.target_arch ?? "none",
            node_openssl_use: process.config?.variables?.node_use_openssl ?? "none",
            node_openssl_version: process?.versions?.openssl ?? "none",
            node_version: process?.versions?.node || process?.version || "none",
            node_modules: process.versions?.modules ?? "none",
            node_lts: process.release?.lts ?? "none",
            node_name: process.release?.name ?? "none",
            v8_use_snapshot: process.config?.variables?.v8_use_snapshot ?? "none",
            v8_version: process.versions?.v8 ?? "none",
            env: process.env
        };
    }
}
module.exports = Manager;