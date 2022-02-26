const KsMf = {
    app: {
        WEB: require('./src/app/AppWEB'),
        Controller: require('./src/app/Controller'),
        Module: require('./src/app/Module'),
        Logger: require('./src/app/Logger'),
        Error: require('./src/app/ErrorHandler')
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
    }
};

module.exports = KsMf;
module.exports.default = KsMf;