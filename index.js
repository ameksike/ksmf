const path = __dirname;
// ... APP ...
const WEB = require(path + '/src/app/AppWEB');
const Controller = require(path + '/src/app/Controller');
const Module = require(path + '/src/app/Module');
const ErrorHandler = require(path + '/src/app/ErrorHandler');
const Logger = require(path + '/src/app/Logger');

// ... TASK ...
const Cron = require(path + '/src/task/cron');

// ... DAO ...
const Base = require(path + '/src/dao/DAO');
const Sequelize = require(path + '/src/dao/DAOSequelize');
const Redis = require(path + '/src/dao/DAORedis');
const Wrapper = require(path + '/src/dao/DAOWrapper');

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