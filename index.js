/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        20/05/2020
 * @copyright   Copyright (c) 2020-2055
 * @license     GPL
 * @version     1.0
 * @description For more information see: https://github.com/ameksike/ksmf/wiki  
 **/

module.exports = {
    app: {
        Base: require('./src/app/App'),
        WEB: require('./src/app/WEB'),
        RTA: require('./src/app/RTA'),
        CLI: require('./src/app/CLI'),
        Proxy: require('./src/app/Proxy'),
    },
    common: {
        Utl: require('./src/common/Utl'),
        Url: require('./src/common/Url'),
        Dir: require('./src/common/Dir'),
        Config: require('./src/common/Config')
    },
    plugin: {
        Controller: require('./src/plugin/Controller'),
        Module: require('./src/plugin/Module'),
    },
    monitor: {
        Manager: require('./src/monitor/Manager'),
        Error: require('./src/monitor/ErrorHandler'),
        Logger: require('./src/monitor/Logger'),
        LoggerManager: require('./src/monitor/LoggerManager'),
        LoggerSimple: require('./src/monitor/LoggerSimple'),
        LoggerWrapper: require('./src/monitor/LoggerWrapper'),
    },
    server: {
        Base: require('./src/server/BaseServer'),
        Request: require('./src/server/BaseRequest'),
        Response: require('./src/server/BaseResponse'),
        Session: require('./src/server/Session')
    },
    proxy: {
        Rule: require('./src/proxy/Rule'),
        Auth: require('./src/proxy/Auth')
    },
    dao: {
        Base: require('./src/dao/DAOBase'),
        DataModule: require('./src/dao/DataModule'),
        DataService: require('./src/dao/DataService'),
        DataController: require('./src/dao/DataController'),
        /**
         * @deprecated
         */
        Redis: require('./src/dao/DAORedis')
    },
    view: {
        Tpl: require('./src/view/Tpl')
    },
    task: {
        Cron: require('./src/task/cron')
    },
    doc: {
        /**
         * @deprecated
         */
        Swagger: require('./src/doc/Swagger')
    }
};