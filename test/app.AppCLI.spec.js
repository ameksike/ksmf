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

    it('Valid argument be processed list as list', () => {
        const res = app.params({
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

    it('Valid argument be processed list as string', () => {
        const res = app.params({
            list: 'npx ksmf run result -v --no-cache --no_cache --verbose --json={"name":"demo"} --testPattern="test=new.test-1" module=plugin:action'
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

    it('Valid argument be processed by default', () => {
        const res = app.params();
        expect(res).toBeInstanceOf(Object);
        expect(res.directory).toBe(undefined);
    });

    it('Valid argument be processed using the index and directory', () => {
        const res = app.params({
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

    it('Valid argument be processed using order', () => {
        const res = app.params({
            index: 3,
            directory: true,
            order: {
                0: 'app',
                1: 'frm',
                2: 'method',
                3: 'mode',
                9: 'plugin',
            },
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
                'model:action',
                '--verbose',
                '--json={"name":"demo"}',
                '--testPattern="test=new.test-1"',
                'module=plugin:action'
            ]
        });
        expect(res).toBeInstanceOf(Object);
        expect(Object.keys(res).length).toBe(15);
        expect(res.directory.length > 1).toBe(true);
        expect(res.testPattern).toBe('"test=new.test-1"');
        expect(res.json).toBe('{"name":"demo"}');
        expect(res.module).toBe("plugin:action");
        expect(res.plugin).toBe("model:action");
        expect(res.mode).toBe("result");
        expect(res.app).toBe("npx");
        expect(res.frm).toBe("ksmf");
        expect(res.method).toBe("run");
        expect(res.v).toBe(true);
        expect(res.run).toBe(undefined);
        expect(res.verbose).toBe(true);
        expect(res.result).toBe(undefined);
        expect(res['no-cache']).toBe(true);
        expect(res['no_cache']).toBe(true);
        expect(res['no.cache']).toBe(true);
        expect(res['no:cache']).toBe(true);
    });

    it('Valid argument be processed by format', () => {
        const res = app.params({
            order: {
                0: 'app',
                1: 'frm',
                2: 'method'
            },
            format: {
                age: (value) => parseFloat(value),
                options: (value) => JSON.parse(value),
            },
            list: [
                'npx',
                'ksmf',
                'run',
                '--options={"name":"demo"}',
                'age=45.6',
                '-tes=45.6',
            ]
        });
        expect(res).toBeInstanceOf(Object);
        expect(res.options.name).toBe("demo");
        expect(res.app).toBe("npx");
        expect(res.frm).toBe("ksmf");
        expect(res.method).toBe("run");
        expect(res.tes).toBe("45.6");
        expect(res.age).toBe(45.6);
        expect(typeof res.tes).toBe("string");
        expect(typeof res.age).toBe("number");
        expect(res.directory).toBe(undefined);
    });
});