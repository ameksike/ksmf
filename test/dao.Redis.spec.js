const DAORedis = require('../src/dao/DAORedis');

describe('DAO_Redis', () => {
    it("should a valid lib", (done) => {
        const dao = new DAORedis();
        expect(dao).toBeInstanceOf(Object);
        done();
    });
});