const WEB = require('./src/app/AppWEB');
const Controller = require('./src/app/Controller');
const Module = require('./src/app/Module');
const ErrorHandler = require('./src/app/ErrorHandler');
const Logger = require('./src/app/Logger');

const Cron = require('./src/task/cron');

const Base = require('./src/dao/DAO');
const Sequelize = require('./src/dao/DAOSequelize');
const Redis = require('./src/dao/DAORedis');

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
        Redis
    },
    task: {
        Cron
    }
}