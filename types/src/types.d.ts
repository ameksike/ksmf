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
};
export type TOption = {
    name?: string;
    type?: string;
    options?: any;
    params?: any;
    dependency?: any;
};
