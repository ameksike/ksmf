/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		20/05/2020
 * @copyright  	Copyright (c) 2020-2035
 * @license    	GPL
 * @version    	1.0
 * @description For more information see: https://github.com/ameksike/ksmf/wiki  
 **/
const KsMf = {
    app: {
        WEB: require('./src/app/AppWEB'),
        RTA: require('./src/app/AppRTA'),
        Controller: require('./src/app/Controller'),
        Module: require('./src/app/Module'),
        Utl: require('./src/app/Utl'),
        Cors: require('./src/app/Cors')
    },
    monitor: {
        Manager: require('./src/monitor/Manager'),
        Error: require('./src/monitor/ErrorHandler'),
        Logger: require('./src/monitor/Logger'),
        LoggerManager: require('./src/monitor/LoggerManager'),
        LoggerSimple: require('./src/monitor/LoggerSimple'),
        LoggerWrapper: require('./src/monitor/LoggerWrapper')
    },
    proxy: {
        App: require('./src/proxy/ProxyApp'),
        Rule: require('./src/proxy/ProxyRule'),
        Auth: require('./src/proxy/ProxyAuth')
    },
    dao: {
        Base: require('./src/dao/DAOBase'),
        Sequelize: require('./src/dao/DAOSequelize'),
        Redis: require('./src/dao/DAORedis'),
        Wrapper: require('./src/dao/DAOWrapper'),
        DataService: require('./src/dao/DataService')
    },
    view: {
        Tpl: require('./src/view/Tpl')
    },
    task: {
        Cron: require('./src/task/cron')
    },
    doc: {
        Swagger: require('./src/doc/Swagger')
    }
};

module.exports = KsMf;
module.exports.default = KsMf.app.WEB;