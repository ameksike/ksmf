export = DataController;
declare class DataController extends Controller {
    /**
     * @description configure action
     * @param {Object} cfg
     * @param {String} cfg.modelName
     * @param {Object} cfg.srv
     * @returns {DataController} self
     */
    configure(cfg: {
        modelName: string;
        srv: any;
    }): DataController;
    modelName: any;
    srv: any;
    init(): Promise<void>;
    logger: any;
    /**
     * @description define groups of validations based on a certain action
     */
    initValidations(): void;
    /**
     * @description get the DTO list
     * @param {Object} req
     * @param {Object} res
     * @returns {{page: Number, size: Number, total: Number, data: Object[] }}
     */
    list(req: any, res: any): {
        page: number;
        size: number;
        total: number;
        data: any[];
    };
    /**
     * @description get the DTO by id
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} DTO
     */
    select(req: any, res: any): any;
    /**
     * @description create new DTO
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} DTO
     */
    insert(req: any, res: any): any;
    /**
     * @description update user by id
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} DTO
     */
    update(req: any, res: any): any;
    /**
     * @description delete user by id
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} DTO
     */
    delete(req: any, res: any): any;
}
import Controller = require("../app/Controller");
