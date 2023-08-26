const KsMf = {
    app: {
        WEB: require('./src/app/AppWEB'),
        RTA: require('./src/app/AppRTA'),
        Controller: require('./src/app/Controller'),
        Module: require('./src/app/Module'),
        Utl: require('./src/app/Utl')
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
        Wrapper: require('./src/dao/DAOWrapper')
    },
    task: {
        Cron: require('./src/task/cron')
    },
    doc: {
        Swagger: require('./src/doc/Swagger')
    }
};

module.exports = KsMf;
module.exports.default = KsMf;