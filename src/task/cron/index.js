/*
 * @author		TropiPay
 * @date		07/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	TropiPay
 * @version    	1.0
 * */
const Module = require('../../app/Module');
class CronModule extends Module {

    init() {
        this.schedule = this.opt.srv.cron || [];
        this.task = {};
        for (let i in this.schedule) {
            this.booking(this.schedule[i], i);
        }
    }

    booking(opt, key) {
        if (!this.helper) return null;
        const cron = this.helper.get({
            name: 'node-cron',
            type: 'lib'
        });
        const value = opt.env ? this.opt.env[opt.env] : opt.value;
        if (!value || !value.trim()) return;
        const task = cron.schedule(value, () => {
            this.helper.get(opt.target);
        }, {
            scheduled: false
        });
        task.start();
        this.task[key] = task;
    }
}
module.exports = CronModule;