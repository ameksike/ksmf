export namespace app {
    let Base: typeof import("./src/app/App");
    let WEB: typeof import("./src/app/WEB");
    let RTA: typeof import("./src/app/RTA");
    let CLI: typeof import("./src/app/CLI");
    let Proxy: typeof import("./src/app/Proxy");
}
export namespace common {
    let Utl: typeof import("./src/common/Utl");
    let Url: typeof import("./src/common/Url");
    let Dir: typeof import("./src/common/Dir");
    let Config: typeof import("./src/common/Config");
}
export namespace plugin {
    let Controller: typeof import("./src/plugin/Controller");
    let Module: typeof import("./src/plugin/Module");
}
export namespace monitor {
    let Manager: typeof import("./src/monitor/Manager");
    let Error: typeof import("./src/monitor/ErrorHandler");
    let Logger: typeof import("./src/monitor/Logger");
    let LoggerManager: typeof import("./src/monitor/LoggerManager");
    let LoggerSimple: typeof import("./src/monitor/LoggerSimple");
    let LoggerWrapper: typeof import("./src/monitor/LoggerWrapper");
}
export namespace server {
    let Base_1: typeof import("./src/server/BaseServer");
    export { Base_1 as Base };
    export let Request: typeof import("./src/server/BaseRequest");
    export let Response: typeof import("./src/server/BaseResponse");
    export let Session: typeof import("./src/server/Session");
}
export namespace proxy {
    let Rule: typeof import("./src/proxy/Rule");
    let Auth: typeof import("./src/proxy/Auth");
}
export namespace dao {
    let Base_2: typeof import("./src/dao/DAOBase");
    export { Base_2 as Base };
    export let DataModule: typeof import("./src/dao/DataModule");
    export let DataService: typeof import("./src/dao/DataService");
    export let DataController: typeof import("./src/dao/DataController");
    export let Redis: typeof import("./src/dao/DAORedis");
}
export namespace view {
    let Tpl: typeof import("./src/view/Tpl");
}
export namespace task {
    let Cron: typeof import("./src/task/cron");
}
export namespace doc {
    let Swagger: typeof import("./src/doc/Swagger");
}
