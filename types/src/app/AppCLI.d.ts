export = AppCLI;
declare class AppCLI extends App {
    /**
     * @description start server
     * @param {import('../types').TAppConfig} [options]
     */
    run(options?: import('../types').TAppConfig): Promise<any>;
    /**
     * @description search a module by CLI route
     * @param {String|null} route
     * @param {String} [sep=':']
     */
    getMetaModule(route: string | null, sep?: string): {
        module: any;
        action: string;
    };
    /**
     * @description process CLI arguments
     * @param {Object} [option]
     * @param {Array} [option.list]
     * @param {Number} [option.index=2]
     * @param {Object} [option.order]
     * @param {Object} [option.format]
     * @param {String} [option.path]
     * @param {Boolean} [option.directory]
     * @returns {Object} result
     */
    getParams(option?: {
        list?: any[];
        index?: number;
        order?: any;
        format?: any;
        path?: string;
        directory?: boolean;
    }): any;
}
import App = require("./App");
