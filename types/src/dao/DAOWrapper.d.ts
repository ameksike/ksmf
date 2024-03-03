export = DAOWrapper;
declare class DAOWrapper {
    /**
     * @description Initialize options on construct DATAWrapper
     * @param {Object} opt
     */
    constructor(opt: any);
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    dao: any;
    cfg: {};
    exclude: any;
    service: any;
    /**
     * @description Set options on Initialize Configuration Event
     * @param {Object} cfg
     */
    onInitConfig(cfg: any): void;
    /**
     * @description load DAO lib and load project models
     */
    onInitModules(): void;
    app: any;
    utl: any;
    /**
     * @description load models for each module
     * @param {Object} mod
     * @returns
     */
    onLoadModule(mod: any): any;
    /**
     * @description create all models associations
     * @param {Array} modules
     */
    onLoadedModules(modules: any[]): void;
    /**
     * @description create all models associations
     */
    loadModules(): void;
    onStop(): void;
}
