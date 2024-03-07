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
     * @returns {Object} result
     */
    getParams(option?: any): any;
}
import App = require("./App");
