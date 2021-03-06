describe('LOAD', () => {
    it("should a valid lib", (done) => {
        const KsMf = require('./index');
        expect(KsMf).toBeInstanceOf(Object);

        expect(KsMf.app.WEB).toBeInstanceOf(Object);
        expect(KsMf.app.Module).toBeInstanceOf(Object);
        expect(KsMf.app.Controller).toBeInstanceOf(Object);
        expect(KsMf.app.Logger).toBeInstanceOf(Object);
        expect(KsMf.app.Error).toBeInstanceOf(Object);
        
        expect(KsMf.dao.Base).toBeInstanceOf(Object);
        expect(KsMf.dao.Sequelize).toBeInstanceOf(Object);
        expect(KsMf.dao.Redis).toBeInstanceOf(Object);
        expect(KsMf.dao.Wrapper).toBeInstanceOf(Object);

        expect(KsMf.task.Cron).toBeInstanceOf(Object);

        expect(KsMf.proxy.App).toBeInstanceOf(Object);
        expect(KsMf.proxy.Rule).toBeInstanceOf(Object);
        expect(KsMf.proxy.Auth).toBeInstanceOf(Object);
        
        expect(KsMf.doc.Swagger).toBeInstanceOf(Object);

        done();
    });
});