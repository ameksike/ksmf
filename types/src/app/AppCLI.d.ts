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
     * @param {Array<String>|String} [option.list]
     * @param {Number} [option.index=2]
     * @param {Object} [option.order]
     * @param {Object} [option.format]
     * @param {String} [option.path]
     * @param {Boolean} [option.directory]
     * @returns {Object} result
     */
    params(option?: {
        list?: Array<string> | string;
        index?: number;
        order?: any;
        format?: any;
        path?: string;
        directory?: boolean;
    }): any;
    /**
     * @description write content in the stdout
     * @param {String|Number|Boolean} message
     * @param {Object} [driver]
     * @param {String|Number|Boolean} [driver.end]
     * @param {import('../types').TWritableStream} [driver.stdout]
     * @param {import('../types').TReadableStream} [driver.stdin]
     */
    write(message: string | number | boolean, driver?: {
        end?: string | number | boolean;
        stdout?: import('../types').TWritableStream;
        stdin?: import('../types').TReadableStream;
    }): void;
    /**
     * @description read content from stdin
     * @param {String|Number|Boolean} [label]
     * @param {Object} [driver]
     * @param {String} [driver.end]
     * @param {String|Number|Boolean} [driver.default]
     * @param {import('../types').TWritableStream} [driver.stdout]
     * @param {import('../types').TReadableStream} [driver.stdin]
     * @returns {Promise<String|Number|Boolean>} content
     */
    read(label?: string | number | boolean, driver?: {
        end?: string;
        default?: string | number | boolean;
        stdout?: import('../types').TWritableStream;
        stdin?: import('../types').TReadableStream;
    }): Promise<string | number | boolean>;
    /**
     * @description stop application
     */
    stop(): void;
}
import App = require("./App");
