// ... APP ...
const WEB = require('./src/app/AppWEB');
const Controller = require('./src/app/Controller');
const Module = require('./src/app/Module');
const ErrorHandler = require('./src/app/ErrorHandler');
const Logger = require('./src/app/Logger');

// ... TASK ...
const Cron = require('./src/task/cron');

// ... DAO ...
const Base = require('./src/dao/DAO');
const Sequelize = require('./src/dao/DAOSequelize');
const Redis = require('./src/dao/DAORedis');
const Wrapper = require('./src/dao/DAOWrapper');

// ... EXPORTS ...
module.exports = {
    app: {
        WEB,
        Controller,
        Module,
        Logger,
        Error: ErrorHandler
    },
    dao: {
        Base,
        Sequelize,
        Redis,
        Wrapper
    },
    task: {
        Cron
    }
}