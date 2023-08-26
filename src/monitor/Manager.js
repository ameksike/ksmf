class Manager {

    onStart(info = {}) {
        const app = this.helper.get('app');
        const logger = this.helper.get('logger');
        const routes = this.getRoutes(app.web);
        logger && logger.info({
            src: "KsMf:Monitor:onStart",
            message: info.message,
            data: {
                url: info.url,
                public: info.public,
                static: info.static,
                routes
            }
        });
    }

    onError(error) {
        const logger = this.helper.get('logger');
        logger && logger.error({
            src: "KsMf:Monitor:onError",
            message: error?.message || error,
            stack: error?.stack
        });
    }

    /**
     * @description get list of available routes
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
                var match = thing.toString()
                    .replace('\\/?', '')
                    .replace('(?=\\/|$)', '$')
                    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
                return match ?
                    match[1].replace(/\\(.)/g, '$1').split('/') :
                    '<complex:' + thing.toString() + '>'
            }
        }
        if (web && web._router && web._router.stack) {
            web._router.stack.forEach(print.bind(null, []));
        }
        return list;
    }
}
module.exports = Manager;