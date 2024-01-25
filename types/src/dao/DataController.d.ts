export = DataController;
declare class DataController extends Controller {
    /**
     * @type {Object|null}
     */
    helper: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @type {String}
     */
    srvName: string;
    /**
     * @description configure action
     * @param {Object} cfg
     * @param {String} [cfg.modelName]
     * @param {String} [cfg.srvName]
     * @param {Object} [cfg.srv]
     * @returns {DataController} self
     */
    configure(cfg: {
        modelName?: string;
        srvName?: string;
        srv?: any;
    }): DataController;
    modelName: any;
    srv: any;
    init(): Promise<void>;
    /**
     * @description define groups of validations based on a certain action
     */
    initValidations(): void;
    /**
     * @description get the DTO list
     * @param {Object} req
     * @param {Object} res
     * @example {{page?: Number; size?: Number; total?: Number; data?: Object[] }}
     */
    list(req: any, res: any): Promise<void>;
    /**
     * @description get the DTO by id
     * @param {Object} req
     * @param {Object} res
     * @returns {Promise<any>} DTO
     */
    select(req: any, res: any): Promise<any>;
    /**
     * @description create new DTO
     * @param {Object} req
     * @param {Object} res
     * @returns {Promise<any>} DTO
     */
    insert(req: any, res: any): Promise<any>;
    /**
     * @description update user by id
     * @param {Object} req
     * @param {Object} res
     * @returns {Promise<any>} DTO
     */
    update(req: any, res: any): Promise<any>;
    /**
     * @description delete user by id
     * @param {Object} req
     * @param {Object} res
     * @returns {Promise<any>} DTO
     */
    delete(req: any, res: any): Promise<any>;
}
import Controller = require("../app/Controller");
