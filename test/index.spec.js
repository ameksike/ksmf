
const KsMf = require('../index');

describe('LOAD', () => {
    it("should a valid lib", () => {
        expect(KsMf).toBeInstanceOf(Object);
        // app
        expect(KsMf.app.WEB).toBeInstanceOf(Function);
        expect(KsMf.app.CLI).toBeInstanceOf(Function);
        expect(KsMf.app.RTA).toBeInstanceOf(Function);
        expect(KsMf.app.Base).toBeInstanceOf(Function);
        expect(KsMf.app.Proxy).toBeInstanceOf(Function);
        // plugin
        expect(KsMf.plugin.Module).toBeInstanceOf(Function);
        expect(KsMf.plugin.Controller).toBeInstanceOf(Function);
        // common
        expect(KsMf.common.Utl).toBeInstanceOf(Function);
        expect(KsMf.common.Utl).toBeInstanceOf(Function);
        expect(KsMf.common.Dir).toBeInstanceOf(Function);
        expect(KsMf.common.Config).toBeInstanceOf(Function);
        // server
        expect(KsMf.server.Base).toBeInstanceOf(Function);
        expect(KsMf.server.Request).toBeInstanceOf(Function);
        expect(KsMf.server.Response).toBeInstanceOf(Function);
        expect(KsMf.server.Session).toBeInstanceOf(Function);
        // monitor
        expect(KsMf.monitor.Manager).toBeInstanceOf(Function);
        expect(KsMf.monitor.Error).toBeInstanceOf(Function);
        expect(KsMf.monitor.Logger).toBeInstanceOf(Function);
        expect(KsMf.monitor.LoggerManager).toBeInstanceOf(Function);
        expect(KsMf.monitor.LoggerSimple).toBeInstanceOf(Function);
        expect(KsMf.monitor.LoggerWrapper).toBeInstanceOf(Function);
        // dao
        expect(KsMf.dao.Base).toBeInstanceOf(Function);
        expect(KsMf.dao.Redis).toBeInstanceOf(Function);
        expect(KsMf.dao.DataService).toBeInstanceOf(Function);
        // task
        expect(KsMf.task.Cron).toBeInstanceOf(Function);
        // view
        expect(KsMf.view.Tpl).toBeInstanceOf(Function);
        // proxy
        expect(KsMf.proxy.Rule).toBeInstanceOf(Function);
        expect(KsMf.proxy.Auth).toBeInstanceOf(Function);
        // doc
        expect(KsMf.doc.Swagger).toBeInstanceOf(Function);
    });
});