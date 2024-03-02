export declare namespace app {
    let WEB: typeof import("./src/app/AppWEB");
    let RTA: typeof import("./src/app/AppRTA");
    let Controller: typeof import("./src/app/Controller");
    let Module: typeof import("./src/app/Module");
    let Utl: typeof import("./src/app/Utl");
    let Url: typeof import("./src/app/Url");
    let Cors: typeof import("./src/app/Cors");
}
export declare namespace monitor {
    let Manager: typeof import("./src/monitor/Manager");
    let Error: typeof import("./src/monitor/ErrorHandler");
    let Logger: typeof import("./src/monitor/Logger");
    let LoggerManager: typeof import("./src/monitor/LoggerManager");
    let LoggerSimple: typeof import("./src/monitor/LoggerSimple");
    let LoggerWrapper: typeof import("./src/monitor/LoggerWrapper");
    let Fingerprint: typeof import("./src/monitor/Fingerprint");
    let Session: typeof import("./src/monitor/Session");
}
export declare namespace server {
    let _default: typeof import("./src/server/ExpressServer");
    export { _default as default };
    export let Express: typeof import("./src/server/ExpressServer");
    export let Fastify: typeof import("./src/server/FastifyServer");
}
export declare namespace proxy {
    let App: typeof import("./src/proxy/ProxyApp");
    let Rule: typeof import("./src/proxy/ProxyRule");
    let Auth: typeof import("./src/proxy/ProxyAuth");
}
export declare namespace dao {
    let Base: typeof import("./src/dao/DAOBase");
    let Sequelize: typeof import("./src/dao/DAOSequelize");
    let Redis: typeof import("./src/dao/DAORedis");
    let Wrapper: typeof import("./src/dao/DAOWrapper");
    let DataModule: typeof import("./src/dao/DataModule");
    let DataService: typeof import("./src/dao/DataService");
    let DataController: typeof import("./src/dao/DataController");
}
export declare namespace view {
    let Tpl: typeof import("./src/view/Tpl");
}
export declare namespace task {
    let Cron: typeof import("./src/task/cron");
}
export declare namespace doc {
    let Swagger: typeof import("./src/doc/Swagger");
}
declare let _default_1: typeof import("./src/app/AppWEB");
export { _default_1 as default };
