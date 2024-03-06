#!/usr/bin/env node

/**
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		20/03/2022
 * @copyright  	Copyright (c) 2020-2035
 * @license    	GPL
 * @version    	1.0
 * @description CLI application 
 * @link        https://github.com/ameksike/ksmf/wiki
 **/

let app = null;
try {
    const KsMf = require('../');
    const path = require('path');

    let dir = path.resolve(process.cwd());
    let act = process.argv[2] || 'web';
    app = new KsMf.app.WEB(dir);

    switch (act) {
        case 'run':
            let target = process.argv[3];
            if (!target) {
                break;
            }
            let opts = target?.split(':');
            let module = opts[0];
            let action = opts[1] || 'run';
            if (target) {
                app.initConfig();
                let obj = app.helper?.get(module);
                obj = obj || app.initModule(module, []);
                if (!obj) {
                    break;
                }
                if (obj[action] instanceof Function) {
                    obj[action](...process.argv.slice(4), app);
                }
            }
            break;

        case 'db':
            app.initConfig();
            let opt = app.cfg.srv.db;
            opt.directory = path.join(dir, opt?.models || 'db/models');
            const tool = app.helper?.get({ name: 'bd.tool' });
            tool.process instanceof Function && tool.process(opt, app.helper?.get('logger'));
            break;

        case 'proxy':
            (new KsMf.proxy.App(dir)).run();
            break;

        default:
            app.run();
            break;
    }
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