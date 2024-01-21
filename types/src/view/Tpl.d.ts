export = TPL;
declare class TPL {
    constructor(cfg?: {});
    logger: any;
    /**
     * @description get file info
     * @param {String} name
     * @param {Object} options
     * @returns {{ file: String, ext: String, path:String, filename: String }}
     */
    getPath(name: string, options: any): {
        file: string;
        ext: string;
        path: string;
        filename: string;
    };
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
    render(name: string, data?: {}, options?: any): string;
    /**
     * @description Compile template
     * @param {String} name
     * @param {Object} options
     * @param {String} options.path
     * @param {String} options.ext
     * @returns {String}
     */
    compile(file: any, data?: {}, options?: {
        path: string;
        ext: string;
    }): string;
    /**
     * @description Interpolate all the options into data string
     * @param {String} data
     * @param {Object} options
     * @returns {String}
     */
    interpolate(content: any, params: any, options?: any): string;
}
