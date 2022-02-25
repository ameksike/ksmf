const KsMf = {
    app: {
        WEB: require('./src/app/AppWEB'),
        Proxy: require('./src/app/AppProxy'),
        Controller: require('./src/app/Controller'),
        Module: require('./src/app/Module'),
        Logger: require('./src/app/Logger'),
        Error: require('./src/app/ErrorHandler')
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