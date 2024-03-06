
const KsMf = require('../index');

describe('LOAD', () => {
    it("should a valid lib", () => {
        expect(KsMf).toBeInstanceOf(Object);

        expect(KsMf.app.WEB).toBeInstanceOf(Function);
        expect(KsMf.app.CLI).toBeInstanceOf(Function);
        expect(KsMf.app.RTA).toBeInstanceOf(Function);
        expect(KsMf.app.Base).toBeInstanceOf(Function);
        expect(KsMf.app.Module).toBeInstanceOf(Function);
        expect(KsMf.app.Controller).toBeInstanceOf(Function);
        expect(KsMf.app.Utl).toBeInstanceOf(Function);

        expect(KsMf.dao.Base).toBeInstanceOf(Function);
        expect(KsMf.dao.Redis).toBeInstanceOf(Function);
        expect(KsMf.dao.DataService).toBeInstanceOf(Function);

        expect(KsMf.task.Cron).toBeInstanceOf(Function);
        expect(KsMf.view.Tpl).toBeInstanceOf(Function);

        expect(KsMf.proxy.App).toBeInstanceOf(Function);
        expect(KsMf.proxy.Rule).toBeInstanceOf(Function);
        expect(KsMf.proxy.Auth).toBeInstanceOf(Function);

        expect(KsMf.doc.Swagger).toBeInstanceOf(Function);

        expect(KsMf.monitor.Manager).toBeInstanceOf(Function);
        expect(KsMf.monitor.Error).toBeInstanceOf(Function);
        expect(KsMf.monitor.Logger).toBeInstanceOf(Function);
        expect(KsMf.monitor.LoggerManager).toBeInstanceOf(Function);
        expect(KsMf.monitor.LoggerSimple).toBeInstanceOf(Function);
        expect(KsMf.monitor.LoggerWrapper).toBeInstanceOf(Function);

        expect(KsMf.server.Base).toBeInstanceOf(Function);
        expect(KsMf.server.Request).toBeInstanceOf(Function);
        expect(KsMf.server.Response).toBeInstanceOf(Function);
        expect(KsMf.server.Session).toBeInstanceOf(Function);
    });
});