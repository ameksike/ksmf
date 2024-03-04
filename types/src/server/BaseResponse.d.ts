export = BaseResponse;
declare const BaseResponse_base: typeof import("ksdp/types/src/integration/Dip");
declare class BaseResponse extends BaseResponse_base {
    constructor(driver: any);
    get request(): any;
    get sent(): any;
    name: string;
    drv: any;
    send(content: any): this;
    status(value?: number): this;
    code(value?: number): this;
    end(): this;
    json(content: any): this;
    redirect(...attr: any[]): this;
    append(field: any, value: any): this;
    headers(value: any): this;
    getHeader(key: any): any;
}
