export type TList<T = any> = {
    [name: string]: T;
};
export type TAppConfig = {
    web?: any;
    drv?: any;
    server?: any;
    cookie?: any;
    session?: any;
    fingerprint?: any;
    cors?: any;
    force?: boolean;
    config?: any;
    code?: number;
    module?: any;
    mode?: string;
};
export type TOption = {
    name?: string;
    type?: string;
    mode?: string;
    options?: any;
    params?: any;
    dependency?: any;
};
export type TCLIArgReq = {
    name?: string;
    type?: string;
    options?: any;
    params?: any;
    dependency?: any;
};
export type TReadableStream = import('stream').Readable;
export type TWritableStream = import('stream').Writable;
