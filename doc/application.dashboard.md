A dashboard is a tool used for information management and business intelligence. Much like the dashboard of a car, data dashboards organize, store, and display important information from multiple data sources into one, easy-to-access place. Using data visualization, dashboards uniquely communicate metrics visually to help users understand complex relationships in their data. In a data dashboard, it’s easier to draw parallels between different but related metrics, identify trends, and head off potential challenges hidden in an organization’s data. With the help of smartphones, tablets, and other mobile technology, dashboards are also used to convey relevant information to audiences at any time and in any place. The best dashboards are customized, secured, and shared with their intended end-users.

A data dashboard is an information management tool that visually tracks, analyzes and displays key performance indicators (KPI), metrics and key data points to monitor the health of a business, department or specific process. They are customizable to meet the specific needs of a department and company. Behind the scenes, a dashboard connects to your files, attachments, services, and API’s, but on the surface displays all this data in the form of tables, line charts, bar charts and gauges. A data dashboard is the most efficient way to track multiple data sources because it provides a central location for businesses to monitor and analyze performance. Real-time monitoring reduces the hours of analyzing and long line of communication that previously challenged businesses.

### Forest Admin
Forest Admin instantly provides all common admin tasks such as CRUD operations, simple chart rendering, user group management, and WYSIWYG interface editor. That’s what makes **Forest Admin** a quick and easy solution to get your admin interface started. For more information about Forest Admin see the following [link](https://docs.forestadmin.com/documentation/).

In case of using Sequelize you must install:
```
npm install forest-express-sequelize
```

in case of using Mongoose, you must install:
```
npm install forest-express-mongoose 
```

```
+ [PROJECT_PATH]/
|    + bin/
|    + cfg/
|    + src/
|    |    +    app/
|    |    +    person/
|    |    +    forest/
|    - package.json
```

let's take a look inside the forest module you have created 
```
+ forest/
|    + config/
|    |    - routes.js
|    + controller/
|    |    - DefaultController.js
|    + model/
|    |    - Person.js
|    - index.js
```

the main class of the module must have a definition similar to the code shown below **[PROJECT_PATH]/src/forest/index.js** 
```js
const KsMf = require('ksmf');
const Liana = require('forest-express-sequelize');
const path = require('path');
const routes = require('./config/routes');

class ForestModule extends KsMf.app.Module {

    init() {
        this.rest = false;
        this.routes = routes;
        super.init();
    }

    async initApp() {
        const dao = this.helper.get('dao');
        const app = this.helper.get('app').web;
        const env = this.helper.get('app').cfg.env;
        const configDir = path.join(__dirname, './model');

        app.use(await Liana.init({
            envSecret: env.FOREST_ENV_SECRET,
            authSecret: env.FOREST_AUTH_SECRET,
            objectMapping: dao.manager,
            connections: { default: dao.driver },
            configDir
        }));

        const logger = this.helper.get('logger');
        if (logger) {
            logger.prefix('FOREST').info('URL', 'https://app.forestadmin.com/projects');
            logger.prefix('FOREST').info('PATH', configDir);
        }
    }
}
module.exports = ForestModule;
```

example of customizing forest models **[PROJECT_PATH]/src/forest/model/Person.js** 
```js
const { collection } = require('forest-express-sequelize');
collection('Person', {
  actions: [
    {
      name: 'Get Extra Data',
      endpoint: "/forest/actions/person/extradata",
    },
    {
      name: 'Set age',
      endpoint: "/forest/actions/person/setAge",
    }
  ],
  fields: [],
  segments: [],
});
```

file containing the list of forest routes **[PROJECT_PATH]/src/forest/config/routes.js** 
```js
module.exports = [
    {
        route: "/forest/actions/person/extradata",
        controller: 'DefaultController',
        action: 'getExtraData',
        method: 'post'
    },
    {
        route: '/forest/actions/person/setAge',
        controller: 'DefaultController',
        action: 'setAge',
        method: 'post'
    }
]
```

example of a controller implementation for forest **[PROJECT_PATH]/src/forest/controller/DefaultController.js** 
```js
const KsMf = require('ksmf');

class DefaultController extends KsMf.app.Controller {

    init() {
        this.srv = this.helper.get({
            name: 'PersonService',
            path: 'service',
            module: 'person',
            options: {
                opt: this.opt
            },
            dependency: {
                dao: 'dao'
            }
        });
    }

    async getExtraData(req, res, next) {
        const ids = req.body.data.attributes.ids;

        const result = await this.srv.select(ids);

        res.json({ success: 'OK', result  });
    }

    async setAge(req, res, next) {
        const ids = req.body.data.attributes.ids;
        const age = req.body.data.attributes.values.age;

        const list = await this.srv.update(ids, { age });

        res.json({ success: 'OK' });
    }

}

module.exports = DepositController;
```

### Related topics 
+ [Skeleton](./common.project.skeleton.md)
+ [Web Server](./advanced.app.web.md)
+ [Modules](./common.modules.md)
+ [Settings](./advanced.setting.md)
+ [Events](./advanced.events.md)

The next recomended topic: [Proxy Server](./application.proxy.server.md).

