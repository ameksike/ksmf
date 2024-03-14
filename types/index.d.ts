export declare namespace app {
    let Base: typeof import("./src/app/App");
    let WEB: typeof import("./src/app/AppWEB");
    let RTA: typeof import("./src/app/AppRTA");
    let CLI: typeof import("./src/app/AppCLI");
    let Controller: typeof import("./src/app/Controller");
    let Module: typeof import("./src/app/Module");
    let Utl: typeof import("./src/app/Utl");
    let Url: typeof import("./src/app/Url");
    let Dir: typeof import("./src/app/Dir");
}
export declare namespace monitor {
    let Manager: typeof import("./src/monitor/Manager");
    let Error: typeof import("./src/monitor/ErrorHandler");
    let Logger: typeof import("./src/monitor/Logger");
    let LoggerManager: typeof import("./src/monitor/LoggerManager");
    let LoggerSimple: typeof import("./src/monitor/LoggerSimple");
    let LoggerWrapper: typeof import("./src/monitor/LoggerWrapper");
    let Session: typeof import("./src/server/Session");
}
export declare namespace server {
    let Base_1: typeof import("./src/server/BaseServer");
    export { Base_1 as Base };
    export let Request: typeof import("./src/server/BaseRequest");
    export let Response: typeof import("./src/server/BaseResponse");
    let Session_1: typeof import("./src/server/Session");
    export { Session_1 as Session };
}
export declare namespace proxy {
    let App: typeof import("./src/proxy/ProxyApp");
    let Rule: typeof import("./src/proxy/ProxyRule");
    let Auth: typeof import("./src/proxy/ProxyAuth");
}
export declare namespace dao {
    let Base_2: typeof import("./src/dao/DAOBase");
    export { Base_2 as Base };
    export let DataModule: typeof import("./src/dao/DataModule");
    export let DataService: typeof import("./src/dao/DataService");
    export let DataController: typeof import("./src/dao/DataController");
    export let Redis: typeof import("./src/dao/DAORedis");
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
declare let _default: typeof import("./src/app/AppWEB");
export { _default as default };
