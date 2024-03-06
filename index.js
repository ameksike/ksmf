/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		20/05/2020
 * @copyright  	Copyright (c) 2020-2035
 * @license    	GPL
 * @version    	1.0
 * @description For more information see: https://github.com/ameksike/ksmf/wiki  
 **/

module.exports = {
    app: {
        Base: require('./src/app/App'),
        WEB: require('./src/app/AppWEB'),
        RTA: require('./src/app/AppRTA'),
        CLI: require('./src/app/AppCLI'),
        Controller: require('./src/app/Controller'),
        Module: require('./src/app/Module'),
        Utl: require('./src/app/Utl'),
        Url: require('./src/app/Url')
    },
    monitor: {
        Manager: require('./src/monitor/Manager'),
        Error: require('./src/monitor/ErrorHandler'),
        Logger: require('./src/monitor/Logger'),
        LoggerManager: require('./src/monitor/LoggerManager'),
        LoggerSimple: require('./src/monitor/LoggerSimple'),
        LoggerWrapper: require('./src/monitor/LoggerWrapper')
    },
    server: {
        Base: require('./src/server/BaseServer'),
        Request: require('./src/server/BaseRequest'),
        Response: require('./src/server/BaseResponse'),
        Session: require('./src/server/Session')
    },
    proxy: {
        App: require('./src/proxy/ProxyApp'),
        Rule: require('./src/proxy/ProxyRule'),
        Auth: require('./src/proxy/ProxyAuth')
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
    },
    default: require('./src/app/AppWEB')
};