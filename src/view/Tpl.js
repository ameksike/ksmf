class TPL {
    constructor(cfg = {}) {
        this.logger = cfg?.logger;
    }
    /**
     * @description get file info 
     * @param {String} name 
     * @param {Object} options 
     * @returns {Object} { file: String, ext: String, path:String, filename: String }
     */
    getPath(name, options) {
        const _path = require("path");
        const ext = options?.ext ? "." + options.ext : "";
        const file = name + ext;
        const path = _path.dirname(file);
        const filename = _path.basename(file);
        return { path, file, filename, ext };
    }

    /**
     * @description Render templates based on twing lib
     * @param {String} name 
     * @param {Object} options 
     * @requires twing
     * @returns {String}
     * @example
     * ................. TEMPLATE FILE
     *	<ul>  
     *		{% for user in users %}
     *        	<li>{{ user.username }}</li>
     *  	{% endfor %}
     *	</ul>
     *	................. JAVASCRIPT FILE
     *	(async () => {
     *		const helpTPL = require('../../utils/TplHandler');
     *		const data1 = await helpTPL.render("WeightAndFuel.html", {
     *			users:[
     *				{username: "Tom"},
     *				{username: "Mito"},
     *				{username: "Codes"},
     *			]
     *		});
     *	})()
     */
    async render(name, data = {}, options = {}) {
        const { path, filename } = this.getPath(name, options);
        if (!path) return "";
        try {
            const { TwingEnvironment, TwingLoaderFilesystem, TwingFunction } = require("twing");
            const loader = new TwingLoaderFilesystem(path);
            const twing = new TwingEnvironment(loader);
            if (options?.functions) {
                for (let i in options.functions) {
                    if (options.functions[i] instanceof Function) {
                        twing.addFunction(new TwingFunction(i, options.functions[i]));
                    }
                }
            }
            return await twing.render(filename, data);
        }
        catch (error) {
            this.logger?.error({
                flow: data?.flow || options?.flow,
                src: "util:TPLHandler:render",
                message: error?.message || error,
                data: { name, path, local: __dirname }
            });
            return "";
        }
    }

    /**
     * @description Compile template 
     * @param {String} name 
     * @param {Object} options 
     * @param {String} options.path 
     * @param {String} options.ext 
     * @returns {String}
     */
    compile(file, data = {}, options = {}) {
        if (!file) return '';
        try {
            const fs = require("fs");
            const src = this.getPath(file, options);
            const content = fs.readFileSync(src?.file, { encoding: 'utf8', flag: 'r' }) || "";
            return this.interpolate(content, data, options)
        }
        catch (error) {
            this.logger.error({
                flow: data?.flow || options?.flow,
                src: "util:TPLHandler:compile",
                error: { message: error?.message || error, stack: error?.stack },
                data: { file, data, options }
            });
            return null;
        }
    }
    /**
     * @description Interpolate all the options into data string
     * @param {String} data 
     * @param {Object} options 
     * @returns {String}
     */
    interpolate(content, params, options = {}) {
        function rex(val, opt = "g") {
            try {
                return new RegExp(val, opt);
            } catch (e) {
                return val;
            }
        }
        try {
            const { open = "{{", close = "}}" } = options;
            if (params) {
                for (let i in params) {
                    content = content.replace(rex(open + i + close), params[i]);
                }
            }
            return content.replace(/\\r|\r|\n|\\n/g, "");
        } catch (error) {
            this.logger.error({
                flow: params?.flow || options?.flow,
                src: "util:TPLHandler:interpolate",
                error: { message: error?.message || error, stack: error?.stack },
                data: { content, params, opt }
            });
            return null;
        }
    }
}
module.exports = TPL;