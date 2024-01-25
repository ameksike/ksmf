/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		22/04/2023
 * @copyright  	Copyright (c) 2020-2030
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
     * @description KsMf Wrapper
     * @param {Object} info 
     */
    onStart(info = {}) {
        const app = this.helper?.get('app');
        const logger = this.helper?.get('logger') || this.logger;
        const routes = this.getRoutes(app.web);
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
    onError(error) {
        const logger = this.helper?.get('logger') || this.logger;
        (logger?.error instanceof Function) && logger?.error({
            src: "KSMF:Monitor:onError",
            message: error?.message || error,
            stack: error?.stack
        });
    }

    /**
     * @description get list of available routes
     * @param {Object} web 
     * @returns {Array} list
     */
    getRoutes(web) {
        const list = [];
        const epss = [];
        function print(path, layer) {
            if (layer.route) {
                layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
            } else if (layer.name === 'router' && layer.handle.stack) {
                layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
            } else if (layer.method) {
                const endpoint = `${layer.method.toUpperCase()} ${path.concat(split(layer.regexp)).filter(Boolean).join('/')}`;
                if (epss.indexOf(endpoint) === -1) {
                    epss.push(endpoint);
                    list.push([layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join('/')]);
                }
            }
        }

        function split(thing) {
            if (typeof thing === 'string') {
                return thing.split('/')
            } else if (thing.fast_slash) {
                return ''
            } else {
                let match = thing.toString()
                    .replace('\\/?', '')
                    .replace('(?=\\/|$)', '$')
                    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
                return match ?
                    match[1].replace(/\\(.)/g, '$1').split('/') :
                    '<complex:' + thing.toString() + '>'
            }
        }
        web?._router?.stack?.forEach(print.bind(null, []));
        return list;
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