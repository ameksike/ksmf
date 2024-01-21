The modules define the behavior that they want to incorporate into the application, they record the controllers that will be used, as well as the routes that are associated with each action of each controller.

### Common example of controller definition
```js
const KsMf = require('ksmf');

class DefaultController extends KsMf.app.Controller {

    constructor(opt) {
        super(opt);
    }

    init() { }

    list(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> LIST.` });
    }

    select(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> SELECT, ID:${req.params.id}.` });
    }

    delete(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> DELETE, ID:${req.params.id}.` });
    }

    clean(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> CLEAN.` });
    }

    update(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> UPDATE, ID:${req.params.id}, name: ${req.body.name}.` });
    }

    insert(req, res, next) {
        res.json({ "message": `REST API <${this.opt.name}> INSERT, name: ${req.body.name}.` });
    }
}

module.exports = DefaultController;
```

### Request data
- **POST/PUT:** for PUT and POST HTTP actions, you can get data from the request base on ``` req.body ``` as an object definition ```{ key : value }``` 
- **GET:** for GET HTTP actions, you can get data from the request base on ``` req.query ``` as an object definition ```{ key : value }``` 
- **PRETTIER:** for prettier URLs, you can get data from the request base on ``` req.params ``` as an object definition ```{ key : value }```

### Adding custom controllers from Module
```js
const KsMf = require('ksmf');

class PersonModule extends KsMf.app.Module {

    initConfig() {
        this.routes.push({ route: this.prefix + '/register', controller: 'RegisterController' });
        // ... for use DefaultController
        super.initConfig(); 
    }

}
module.exports = PersonModule;

```
As in the previous example, to add a new controller, the *Module::initConfig* function must be redefined, specifying the path that responds to said controller. The *Module::prefix* property defines the prefix for the module routes, but its use is not mandatory. By default, each module defines the DefaultController controller, if you want to keep it you must call *super.initConfig()*


By default, the controllers implement the routes associated with a REST API or RESTFul service, adopting the following convention:

```
-----------------------------------------------------
 METHOD | URL PATH             | CONTROLLER ACTION
-----------------------------------------------------
 GET      /prefix/resource        Controller::list
 GET      /prefix/resource/:id    Controller::select
 POST     /prefix/resource        Controller::insert
 PUT      /prefix/resource/:id    Controller::update
 PATCH    /prefix/resource/:id    Controller::update
 DELETE   /prefix/resource/:id    Controller::delete
 DELETE   /prefix/resource        Controller::clean
 -----------------------------------------------------
```

It is also possible to define new routes by modifying the *Module::initRoutesREST* or *Module::initRoutesWeb* being *initRoutesWeb* the recommended one in case you do not want to modify the rest of the RESTFull type routes and avoiding issues by not explicitly calling *super.initRoutesREST(opt)*

### Adding custom routes and REST controller
```js
const KsMf = require('ksmf');
class AppModule extends KsMf.app.Module {

    initConfig() {
 
        this.routes = [
            {
                route: this.prefix + "/auth/login",
                controller: 'DefaultController',
                action: 'login',
                method: 'post'
            }, 
            {
                route: this.prefix + "/auth/logout",
                controller: 'DefaultController',
                action: 'logout',
                method: 'get'
            },
            {
                route: this.prefix + "/person",
                controller: 'CrudController',
                method: 'rest'
            }
        ];

    }
}
module.exports = AppModule;
```

The routing table in the previous example looks like this:
```
-----------------------------------------------------------
 METHOD | URL PATH             | CONTROLLER ACTION
-----------------------------------------------------------
 POST	  /app/auth/login	 DefaultController::login
 GET	  /app/auth/logout	 DefaultController::logout
 
 GET      /app/person        	 CrudController::list
 GET      /app/person/:id    	 CrudController::select
 POST     /app/person        	 CrudController::insert
 PUT      /app/person/:id    	 CrudController::update
 PATCH    /app/person/:id    	 CrudController::update
 DELETE   /app/person/:id    	 CrudController::delete
 DELETE   /app/person        	 CrudController::clean
 -----------------------------------------------------------
```
```
+ app/
|    + controller/
|    |    - DefaultController.js
|    |    - CrudController.js
|    + model/
|    |    - Person.js
|    - index.js
```
When specifying the **REST** type method, the *INSERT, UPDATE, DELETE, CLEAN, SELECT and LIST* routes are automatically defined on the specified controller. It is also possible to disable REST type options by setting the global property called rest to false. 

```js
class ForestModule extends KsMf.app.Module {

    init() {
        this.rest = false;
        this.routes = require('./config/routes');
        super.init();
    }
}
```
In the previous example, the rest options are disabled and routes definition is delegated to an external file, for get a clean code, with content similar to that shown below:

```js
module.exports = [
    {
        route: "/forest/actions/person/extradata",
        controller: 'PersonController',
        action: 'getExtraData',
        method: 'post'
    },
    {
        route: '/forest/actions/person/confirmed',
        controller: 'PersonController',
        action: 'setConfirmed',
        method: 'post'
    }
]
```
```
+ forest/
|    + config/
|    |    - routes.js
|    + controller/
|    |    - PersonController.js
|    + model/
|    |    - Person.js
|    - index.js
```

### Adding custom routes to a controller by redefinition
```js
const KsMf = require('ksmf');

class PersonModule extends KsMf.app.Module {

    initConfig() {
        this.routes.push({ route: this.prefix + '/address', controller: 'AddressController' });
    }

    initRoutesREST(opt) {
        if (opt.controller === 'AddressController') {
            const _prefix = opt.route;
            const _controller = this.helper.get({
                name: opt.controller,
                path: 'controller',
                module: this.name,
                options: {
                    opt: this.opt,
                    dao: this.dao
                },
                dependency: {
                    'helper': 'helper'
                }
            });

            this.app.get(_prefix + "/fill", (req, res, next) => {
                _controller.fill(req, res, next);
            });
        }

        super.initRoutesREST(opt);
    }
}
module.exports = PersonModule;

```



Taking it into account, for example, for a module named *Person* and a controller named *Address*, the routing pattern would be the following:

```
-----------------------------------------------------------
 METHOD | URL PATH             | CONTROLLER ACTION
-----------------------------------------------------------
 GET      /person/address        AddressController::list
 GET      /person/address/:id    AddressController::select
 POST     /person/address        AddressController::insert
 PUT      /person/address/:id    AddressController::update
 PATCH    /person/address/:id    AddressController::update
 DELETE   /person/address/:id    AddressController::delete
 DELETE   /person/address        AddressController::clean
 -----------------------------------------------------------
```

and for custom routes like the one in the previous example, it would be:

```
-----------------------------------------------------------
 METHOD | URL PATH             | CONTROLLER ACTION
-----------------------------------------------------------
 GET      /person/fill           AddressController::fill
-----------------------------------------------------------
```

### Related topics 
+ [Data Base](./common.DAO.md)
+ [Modules](./common.modules.md)
+ [Test](./advanced.test.md)
+ [App](./advanced.app.web.md)
+ [Settings](./advanced.setting.md)

The next recomended topic: [Services](./common.services.md).