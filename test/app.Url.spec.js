const KsMf = require('../index');
const uri = KsMf.app.Url.self();

describe('Url', () => {

    it('isValid', () => {
        expect(uri.isValid("/domain")).toBe(false);
        expect(uri.isValid("http://mito/domain")).toBe(true);
        expect(uri.isValid("http://localhost:8080/domain")).toBe(true);
        expect(uri.isValid("domain")).toBe(false);
    });

    it('parse', () => {
        let dta = uri.parse("http://io:tst@localhost:8080/domain?name=io&age=12");
        expect(dta.host).toBe("localhost:8080");
        expect(dta.port).toBe("8080");
        expect(dta.hostname).toBe("localhost");
        expect(dta.password).toBe("tst");
        expect(dta.username).toBe("io");
        expect(dta.protocol).toBe("http:");
        expect(dta.pathname).toBe("/domain");
        expect(dta.search).toBe("?name=io&age=12");
    });

    it('format', () => {
        let dta = uri.format({ host: "localhost", protocol: "https" }, { pathname: "/domain" });
        expect(dta).toBe('https://localhost/domain');
    });

    it('add', () => {
        let dta = uri.add('https://localhost/domain', { name: "mito", age: 15 });
        expect(dta).toBe('https://localhost/domain?name=mito&age=15');
    });

    it('add for pathname only', () => {
        let dta = uri.add('/domain/reg', { name: "mito", age: 15 }, { host: "localhost", protocol: "https" });
        expect(dta).toBe('https://localhost/domain/reg?name=mito&age=15');
    });

    it('add for invalid', () => {
        expect(uri.add('tst', { name: "mito", age: 15 })).toBe('');
        expect(uri.add('/domain/reg', { name: "mito", age: 15 })).toBe('');
        expect(uri.add(null, { name: "mito", age: 15 })).toBe('');
    });

    it('Param To Str', () => {
        expect(uri.param2Str({ name: "steve", age: 12 })).toBe("name=steve&age=12");
        expect(uri.param2Str({ name: "steve", age: 12 }, "group=max")).toBe("group=max&name=steve&age=12");
    });

    it('add params custom', () => {
        const req = { protocol: "http" };

        expect(uri.add("/person", { name: "steve", age: 12 }, req)).toBe("http://person/?name=steve&age=12");
        expect(uri.add("/person", { name: "steve", age: 12 }, { force: true })).toBe("/person?name=steve&age=12");
        expect(uri.add("/person/", { name: "steve", age: 12 }, { force: true })).toBe("/person/?name=steve&age=12");
        expect(uri.add("/person?group=max", { name: "steve", age: 12 }, { force: true })).toBe("/person?group=max&name=steve&age=12");

        expect(uri.add("http://localhost/person?group=max", { name: "steve", age: 12 }, { force: true })).toBe("http://localhost/person?group=max&name=steve&age=12");
        expect(uri.add("http://127.0.0.1:8080/person", { name: "steve", age: 12 })).toBe("http://127.0.0.1:8080/person?name=steve&age=12");
        expect(uri.add("http://127.0.0.1:8080/person/", { name: "steve", age: 12 })).toBe("http://127.0.0.1:8080/person/?name=steve&age=12");
        expect(uri.add("http://127.0.0.1:8080/person?group=max", { name: "steve", age: 12 })).toBe("http://127.0.0.1:8080/person?group=max&name=steve&age=12");
    });
});

