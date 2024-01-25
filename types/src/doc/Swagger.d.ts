export = Swagger;
declare class Swagger {
    /**
     * @description Initialize options on construct Swagger
     * @param {Object} opt
     */
    constructor(opt: any);
    cfg: {};
    exclude: any;
    definition: {};
    /**
     * @description Set options on Initialize Configuration Event
     * @param {Object} cfg
     */
    onInitConfig(cfg: any): void;
    /**
     * @description load models for each module
     * @param {Object} mod
     * @returns
     */
    onLoadModule(mod: any): void;
    /**
     * @description create all models associations
     * @param {Object} app
     */
    onInitCompleted(app: any): any;
    /**
     * @description Simple object check.
     * @param item
     * @returns {Boolean}
     */
    isObject(item: any): boolean;
    /**
     * @description Deep merge two objects.
     * @param target
     */
    mergeDeep(target: any, ...sources: any[]): any;
}
