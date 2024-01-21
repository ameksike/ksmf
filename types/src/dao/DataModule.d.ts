export = DataModule;
declare class DataModule extends Module {
    configure(payload: any): void;
    db: any;
    init(): any;
}
import Module = require("../app/Module");
