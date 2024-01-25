export = DataModule;
declare class DataModule extends Module {
    /**
     * @description initialize module
     * @param {Object} payload
     * @param {Object} [payload.app]
     * @param {Object} [payload.web]
     * @param {Object} [payload.opt]
     * @param {Object} [payload.db]
     * @returns {DataModule} self
     */
    configure(payload: {
        app?: any;
        web?: any;
        opt?: any;
        db?: any;
    }): DataModule;
    db: any;
    init(): any;
}
import Module = require("../app/Module");
