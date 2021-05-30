/*
 * @author		TropiPay
 * @date		07/04/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	TropiPay
 * @version    	1.0
 * @dependency  node-cron
 * */
class CronModule {

    onInitConfig(cfg) {
        if (cfg && cfg.srv && cfg.srv.cron) {
            this.configure(cfg.srv.cron, cfg.env);
        }
    }

    configure(options, env) {
        this.env = env || {};
        this.schedule = options || [];
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
        const value = opt.env ? this.env[opt.env] : opt.value;
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