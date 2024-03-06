#!/usr/bin/env node

/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        20/03/2022
 * @copyright   Copyright (c) 2020-2035
 * @license     GPL
 * @version     1.0
 * @description CLI application 
 * @link        https://github.com/ameksike/ksmf/wiki
 **/

let app = null;
try {
    const KsMf = require('../');
    const path = require('path');

    let dir = path.resolve(process.cwd());
    let act = process.argv[2] || 'web';

    switch (act) {
        case 'web':
            app = new KsMf.app.WEB(dir);
            break;

        case 'db':
            app = new KsMf.app.App(dir);
            app.initConfig();
            let opt = app.cfg.srv.db;
            opt.directory = path.join(dir, opt?.models || 'db/models');
            const tool = app.helper?.get({
                name: 'bd.tool',
                'dependency': {
                    'helper': 'helper',
                    'logger': 'logger',
                }
            });
            tool?.process instanceof Function && tool.process(opt);
            break;

        case 'proxy':
            app = new KsMf.proxy.App(dir);
            break;

        default:
            app = new KsMf.app.CLI(dir);
            break;
    }

    app?.run();
}
catch (error) {
    console.log({
        flow: String(Date.now()) + '00',
        level: 1,
        src: 'KSMF:bin:CLI',
        error
    });
}

module.exports = app;