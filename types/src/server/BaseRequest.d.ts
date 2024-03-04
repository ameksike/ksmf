export = BaseRequest;
declare const BaseRequest_base: typeof import("ksdp/types/src/integration/Dip");
declare class BaseRequest extends BaseRequest_base {
    constructor(driver: any);
    get query(): any;
    get body(): any;
    get params(): any;
    get method(): any;
    get protocol(): any;
    get headers(): any;
    get hostname(): any;
    get originalUrl(): any;
    get ip(): any;
    get options(): any;
    name: string;
    drv: any;
}
