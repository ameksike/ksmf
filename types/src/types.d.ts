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
    port?: number;
    host?: string;
    protocol?: string;
    key?: string;
    cert?: string;
    app?: string;
};
