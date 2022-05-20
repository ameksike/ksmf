const DAOSequelize = require('./DAOSequelize');

describe('DAO_Sequelize', () => {
    it("should a valid lib", (done) => {
        const dao = new DAOSequelize();
        expect(dao).toBeInstanceOf(Object);
        done();
    });
});