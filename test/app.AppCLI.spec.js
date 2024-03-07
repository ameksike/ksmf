const KsMf = require('../');

const app = new KsMf.app.CLI({
    path: __dirname + '/../'
});

describe('App CLI', () => {

    it('Valid app instance', () => {
        expect(app).toBeInstanceOf(Object);
        expect(app.path?.length > 10).toBe(true);
        expect(app.cfg?.path?.length > 10).toBe(false);
        expect(app.cfg?.eid?.length > 1).toBe(false);
        expect(!!app.cfg.env).toBe(false);
        expect(app.helper).toBeInstanceOf(Object);
        expect(app.event).toBeInstanceOf(Object);
        expect(app.mod).toBeInstanceOf(Array);
    });

    it('Valid app config', () => {
        app?.initLoad();
        expect(app.cfg.path.length > 10).toBe(true);
        expect(app.cfg.eid.length > 1).toBe(true);
        expect(!!app.cfg.env).toBe(true);
        expect(app.cfg.pack).toBeInstanceOf(Object);
        expect(app.config).toBeInstanceOf(Object);
        expect(app.helper).toBeInstanceOf(Object);
        expect(app.event).toBeInstanceOf(Object);
        expect(app.mod).toBeInstanceOf(Array);
    });
    it('Valid argument be processed by default', () => {
        const res = app.getParams();
        expect(res).toBeInstanceOf(Object);
        expect(res.directory).toBe(undefined);
        console.log(res)
    });

    it('Valid argument be processed', () => {
        const res = app.getParams({
            list: [
                'npx',
                'ksmf',
                'run',
                'result',
                '-v',
                '--no-cache',
                '--no_cache',
                '--verbose',
                '--json={"name":"demo"}',
                '--testPattern="test=new.test-1"',
                'module=plugin:action'
            ]
        });
        expect(res).toBeInstanceOf(Object);
        expect(res.directory).toBe(undefined);
        expect(res.testPattern).toBe('"test=new.test-1"');
        expect(res.json).toBe('{"name":"demo"}');
        expect(res.module).toBe("plugin:action");
        expect(res.v).toBe(true);
        expect(res.run).toBe(true);
        expect(res.verbose).toBe(true);
        expect(res.result).toBe(true);
        expect(res['no-cache']).toBe(true);
        expect(res['no_cache']).toBe(true);
    });

    it('Valid argument be processed using the index and directory', () => {
        const res = app.getParams({
            index: 3,
            directory: true,
            list: [
                'npx',
                'ksmf',
                'run',
                'result',
                '-v',
                '--no-cache',
                '--no_cache',
                '--no.cache',
                '--no:cache',
                '--verbose',
                '--json={"name":"demo"}',
                '--testPattern="test=new.test-1"',
                'module=plugin:action'
            ]
        });
        expect(res).toBeInstanceOf(Object);
        expect(Object.keys(res).length).toBe(11);
        expect(res.directory.length > 1).toBe(true);
        expect(res.testPattern).toBe('"test=new.test-1"');
        expect(res.json).toBe('{"name":"demo"}');
        expect(res.module).toBe("plugin:action");
        expect(res.v).toBe(true);
        expect(res.run).toBe(undefined);
        expect(res.verbose).toBe(true);
        expect(res.result).toBe(true);
        expect(res['no-cache']).toBe(true);
        expect(res['no_cache']).toBe(true);
        expect(res['no.cache']).toBe(true);
        expect(res['no:cache']).toBe(true);
    });
});