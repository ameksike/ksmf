const DAOBase = require('../src/dao/DAOBase');
const dao = new DAOBase();

describe('DAO_Base', () => {
    it("should a valid connection object string without password", (done) => {
        const res = dao.conn2str({
            "port": 6379,
            "host": "127.0.0.1",
            "database": "default",
            "username": "ksdt",
            "protocol": "mysql"
        });
        expect(typeof (res)).toBe('string');
        expect(res).toBe("mysql://ksdt@127.0.0.1:6379/default");
        done();
    });
    
    it("should a valid connection string without user", (done) => {
        const res = dao.conn2str({
            "port": 6379,
            "host": "127.0.0.1",
            "database": "default",
            "password": "myksdt",
            "protocol": "mysql"
        });
        expect(typeof (res)).toBe('string');
        expect(res).toBe("mysql://:myksdt@127.0.0.1:6379/default");
        done();
    });

    it("should a valid connection object to string", (done) => {
        const res = dao.conn2str({
            "database": "mydb",
            "username": "ksdt",
            "password": "dext",
            "protocol": "postgres",
        });
        expect(typeof (res)).toBe('string');
        expect(res).toBe("postgres://ksdt:dext@127.0.0.1/mydb");
        done();
    });
});