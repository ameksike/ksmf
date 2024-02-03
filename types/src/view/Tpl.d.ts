export = TPL;
/**
 * @description it's recommended to use KsTPL instead
 * @deprecated
 */
declare class TPL {
    constructor(cfg?: {});
    /**
     * @type {Console}
     */
    logger: Console;
    /**
     * @description get file info
     * @param {String} name
     * @param {Object} [options]
     * @param {String} [options.ext]
     * @returns {{ file: String, ext: String, path:String, filename: String }}
     */
    getPath(name: string, options?: {
        ext?: string;
    }): {
        file: string;
        ext: string;
        path: string;
        filename: string;
    };
    /**
     * @description Render templates based on twing lib
     * @param {String} name
     * @param {Object} data
     * @param {String} [data.flow]
     * @param {Object} options
     * @param {String} [options.path]
     * @param {String} [options.ext]
     * @param {String} [options.flow]
     * @param {Array} [options.functions]
     * @requires twing
     * @returns {Promise<string>}
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
    render(name: string, data?: {
        flow?: string;
    }, options?: {
        path?: string;
        ext?: string;
        flow?: string;
        functions?: any[];
    }): Promise<string>;
    /**
     * @description Compile template
     * @param {String} file
     * @param {Object} [data]
     * @param {String} [data.flow]
     * @param {Object} [options]
     * @param {String} [options.path]
     * @param {String} [options.ext]
     * @param {String} [options.flow]
     * @returns {String}
     */
    compile(file: string, data?: {
        flow?: string;
    }, options?: {
        path?: string;
        ext?: string;
        flow?: string;
    }): string;
    /**
     * @description Interpolate all the options into data string
     * @param {String} content
     * @param {Object} [params]
     * @param {String} [params.flow]
     * @param {Object} [options]
     * @param {String} [options.flow]
     * @param {String} [options.open]
     * @param {String} [options.close]
     * @returns {String}
     */
    interpolate(content: string, params?: {
        flow?: string;
    }, options?: {
        flow?: string;
        open?: string;
        close?: string;
    }): string;
}
