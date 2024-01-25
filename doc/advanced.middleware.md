### Overview
Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function, when it is invoked, executes the middleware succeeding the current middleware. For more information, see the [middleware section](https://expressjs.com/en/guide/writing-middleware.html) of the express framework. In KsMf the middlewares are defined at two levels: **modules** and **controllers**, using the property called **middleware** as a reserved word for the framework. 

### Module
The **middleware** property is an object where each index is made up of an array of anonymous functions with the prototype:
```js
(req, res, next) => {}
```
These indexes must match the controller functions that are associated with the routes defined in the module. In case you want to associate a group of middlewares to all actions, use the indexed index called **global**.  

```js
this.middleware.global.push((req, res, next) => {
	const auth = this.helper.get('auth');
	if (auth) {
		auth.apikey(req, res, next);
	}
});
```

In the case of REST type controllers, a set of indices are also defined automatically that correspond to the functions that are defined in two controllers, observe the example shown below: 
```js
const KsMf = require('ksmf');
class PersonModule extends KsMf.app.Module {
    initConfig() {
        this.middleware.list.push((req, res, next) => next());
        this.middleware.select.push((req, res, next) => next());
        this.middleware.insert.push((req, res, next) => next());
        this.middleware.update.push((req, res, next) => next());
        this.middleware.delete.push((req, res, next) => next());
        this.middleware.option.push((req, res, next) => next());
        this.middleware.clean.push((req, res, next) => next());
    }
}
module.exports = PersonModule;
```
In any of the cases described above, these middlewares would be applied to all the module's controllers, however it is also possible from the module interface to define the specific middlewares of each controller, it is possible from the configuration of the routes: 
 
```js
const KsMf = require('ksmf');
class PersonModule extends KsMf.app.Module {

    initConfig() {
        this.middleware.list.push((req, res, next) => next());
        this.routes = [
            {
                route: "/api" + this.prefix,
                controller: 'PersonController',
                method: 'rest',
                middleware: {
                    global: [(req, res, next) => {
                        const auth = this.helper.get('auth');
                        if (auth) {
                            auth.apikey(req, res, next);
                        }
                    }]
                }
            }
        ];
    }
}
module.exports = PersonModule;
```
In the previous example a middleware is specified that intercepts all requests to control access, this is a security example. These settings take precedence over the middleware settings described in the controller itself.

### Controller

In the controllers, it is specified similar to how the middlewares are defined in the module 
```js
const KsMf = require('ksmf');
class PersonController extends KsMf.app.Controller {

    init() {
        this.middleware.list.push((req, res, next) => next());
        this.middleware.select.push((req, res, next) => next());
        this.middleware.insert.push((req, res, next) => next());
        this.middleware.update.push((req, res, next) => next());
        this.middleware.delete.push((req, res, next) => next());
        this.middleware.option.push((req, res, next) => next());
        this.middleware.clean.push((req, res, next) => next());
    }	
}
module.exports = PersonController;
```
Note that the middleware specified in the specific controller will be overwritten if it is defined in the 'routes' property of the module, so the middleware implemented from the controller will never be executed.

### App
in case it is required to associate a middleware at the global web server level, it can be done from the module, as shown below: 
```js
const KsMf = require('ksmf');
const Liana = require('forest-express-sequelize');
const path = require('path');

class ForestModule extends KsMf.app.Module {

    async initApp() {
        const dao = this.helper.get('dao');
        const app = this.helper.get('app').web;
        const env = this.helper.get('app').cfg.env;

        app.use(await Liana.init({
            envSecret: env.FOREST_ENV_SECRET,
            authSecret: env.FOREST_AUTH_SECRET,
            objectMapping: dao.manager,
            connections: { default: dao.driver },
            configDir: path.join(__dirname, './model')
        }));
    }
}
module.exports = ForestModule;
```
See the complete example in the [dashboard](./application.dashboard.md) section where an integration is made with ForestAdmin. 

### Related topics 
+ [Skeleton](./common.project_skeleton.md)
+ [Web Server](./advanced.app_web.md)
+ [Modules](./common.modules.md)
+ [Settings](./advanced.setting.md)
+ [Events](./advanced.events.md)

The next recomended topic: [Cron / Schedule](./advanced.cron.md).