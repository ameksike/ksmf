
const KsMf = require('../index');

describe('LOAD', () => {
    it("should a valid lib", () => {
        expect(KsMf).toBeInstanceOf(Object);

        expect(KsMf.app.WEB).toBeInstanceOf(Object);
        expect(KsMf.app.Module).toBeInstanceOf(Object);
        expect(KsMf.app.Controller).toBeInstanceOf(Object);
        expect(KsMf.app.Utl).toBeInstanceOf(Object);
        expect(KsMf.app.Cors).toBeInstanceOf(Object);

        expect(KsMf.dao.Base).toBeInstanceOf(Function);
        expect(KsMf.dao.Sequelize).toBeInstanceOf(Function);
        expect(KsMf.dao.Redis).toBeInstanceOf(Function);
        expect(KsMf.dao.Wrapper).toBeInstanceOf(Function);
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
        expect(KsMf.monitor.Session).toBeInstanceOf(Function);
    });
});