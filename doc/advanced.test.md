KsMf promotes TDD based development using the Jest library. Jest is a delightful JavaScript Testing Framework with a focus on simplicity, for more information about this library see the following [link](https://jestjs.io/). 

### Test Driven Development (TDD) 
TDD is a software development process relying on software requirements being converted to test cases before software is fully developed, and tracking all software development by repeatedly testing the software against all test cases. This is opposed to software being developed first and test cases created later. 

There are various aspects to using test-driven development, for example the principles of "_keep it simple, stupid_" (**KISS**) and "_You aren't gonna need it_" (**YAGNI**). By focusing on writing only the code necessary to pass tests, designs can often be cleaner and clearer than is achieved by other methods. In Test Driven Development by Example, Kent Beck also suggests the principle "_Fake it till you make it_".

To achieve some advanced design concept, such as a design pattern, tests are written that generate that design. The code may remain simpler than the target pattern, but still pass all required tests. This can be unsettling at first but it allows the developer to focus only on what is important.

### Writing the tests first 
The tests should be written before the functionality that is to be tested. This has been claimed to have many benefits. It helps ensure that the application is written for testability, as the developers must consider how to test the application from the outset rather than adding it later. It also ensures that tests for every feature get written. Additionally, writing the tests first leads to a deeper and earlier understanding of the product requirements, ensures the effectiveness of the test code, and maintains a continual focus on software quality. When writing feature first code, there is a tendency by developers and organizations to push the developer on to the next feature, even neglecting testing entirely. The first TDD test might not even compile at first, because the classes and methods it requires may not yet exist. Nevertheless, that first test functions as the beginning of an executable specification.

### Each test case fails initially
This ensures that the test really works and can catch an error. Once this is shown, the underlying functionality can be implemented. This has led to the "test driven development mantra", which is "red/green/refactor", where red means fail and green means pass. Test-driven development constantly repeats the steps of adding test cases that fail, passing them, and refactoring. Receiving the expected test results at each stage reinforces the developer's mental model of the code, boosts confidence and increases productivity. 

### Test Structure

Effective layout of a test case ensures all required actions are completed, improves the readability of the test case, and smooths the flow of execution. Consistent structure helps in building a self-documenting test case. A commonly applied structure for test cases has (1) setup, (2) execution, (3) validation, and (4) cleanup.

 
1. **Setup:** Put the Unit Under Test (UUT) or the overall test system in the state needed to run the test.
2. **Execution:** Trigger/drive the UUT to perform the target behavior and capture all output, such as return values and output parameters. This step is usually very simple.
3. **Validation:** Ensure the results of the test are correct. These results may include explicit outputs captured during execution or state changes in the UUT.
4. **Cleanup:** Restore the UUT or the overall test system to the pre-test state. This restoration permits another test to execute immediately after this one. In some cases in order to preserve the information for possible test failure analysis, the cleanup should be starting the test just before the test's setup run.

### Test on Module
In general, the tests are organized in two directories **controller** and **services**, controller for *integration tests* and services for *unit tests*.

```
+ person/
|    + config/
|    |    - routes.js
|    + controller/
|    |    - DefaultController.js
|    |    - DefaultController.spec.js
|    + service/
|    |    - DefaultService.js
|    |    - DefaultService.spec.js
|    + model/
|    |    - Person.js
|    - index.js
```
**Note:** tests are identified by the prefix '.spec' 

### Unit Test 
unit testing is a software testing method by which individual units of source code sets of one or more computer program modules together with associated control data, usage procedures, and operating procedures are tested to determine whether they are fit for use.
```js
const KsMf = require('ksmf');
const app = new KsMf.app.WEB(__dirname + "/../../../").init();

describe('APP controller', () => {
    beforeAll(async () => { });

    afterAll(async () => { });

    it("should a valid call for app service", (done) => {
        const srv = app.helper.get({
            name: 'Authenticator',
            dependency: { 'helper': 'helper' }
        });
        expect(srv).toBeInstanceOf(Object);
        done();
    });
}
```

### Integration Test 
Integration testing (sometimes called integration and testing, abbreviated I&T) is the phase in software testing in which individual software modules are combined and tested as a group. Integration testing is conducted to evaluate the compliance of a system or component with specified functional requirements. It occurs after unit testing and before validation testing. Integration testing takes as its input modules that have been unit tested, groups them in larger aggregates, applies tests defined in an integration test plan to those aggregates, and delivers as its output the integrated system ready for system testing. 
```js
const KsMf = require('ksmf');
const app = new KsMf.app.WEB(__dirname + "/../../../").init();
const web = app.web;
const dao = app.helper.get('dao');

const supertest = require('supertest');
const req = supertest(web);

const baseUrl = '/person';
const models = {};
const header = { 'Authorization': 'Bearer ' };

describe('Etl DepositAccount CRUD', () => {

    beforeAll(async () => {
        try {
            const auth = app.helper.get('auth');
            header.Authorization = 'Bearer ' + auth.generateApikey();

            jest.useFakeTimers();
            await dao.driver.sync({ force: true });
            const model = dao.models['Person'];

            models.obj1 = await model.create({
                "name": "Smith",
                "age": 55,
                "sex": "M",
            });

        } catch (error) {
            console.log(error.toString());
        }
    });

    afterAll(async () => {
        for (let i in models) {
            models[i].destroy();
        }
        web.stop();
    });

    it("should a valid request list", (done) => {
        req
            .get(baseUrl)
            .set(header)
            .send({
                "version": '2.1',
            })
            .end((error, res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toBeInstanceOf(Array);
                done();
            });
    });
});
```

### Related topics 
+ [Data Base](./common.DAO.md)
+ [Modules](./common.modules.md)
+ [Test](./advanced.test.md)
+ [App](./advanced.app.web.md)
+ [Settings](./advanced.setting.md)

The next recomended topic: [Web App](./advanced.app.web.md).