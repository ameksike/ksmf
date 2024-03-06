export = AppCLI;
declare class AppCLI extends App {
    /**
     * @description start server
     * @param {import('../types').TAppConfig} [options]
     */
    run(options?: import('../types').TAppConfig): Promise<any>;
}
import App = require("./App");
