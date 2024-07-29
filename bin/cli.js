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

    switch (act.toLowerCase()) {
        case 'web':
            app = new KsMf.app.WEB({ path: dir });
            break;

        case 'proxy':
            app = new KsMf.proxy.App({ path: dir });
            break;

        default:
            app = new KsMf.app.CLI({ path: dir });
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