# KsMf
Modular Microframework for create minimalistic web application or REST API based on [Express Js](https://expressjs.com/es/) and [KsDp](https://github.com/ameksike/ksdp/wiki), for more information see our [wiki](https://github.com/ameksike/ksmf/wiki).


### Install from [npm package](https://www.npmjs.com/package/ksmf)
``` npm install ksmf ```

[![Rate on Openbase](https://badges.openbase.com/js/rating/ksmf.svg)](https://openbase.com/js/ksmf?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)

## Project Skeleton

```
+ bin/
|    - server.js
+ cfg/
|    - config.json
|    - core.json
+ src/
|    + app/
|    |    + controller/
|    |    |    - DefaultController.js
|    |    |    - DefaultController.spec.js
|    |    + service/
|    |    + model/
|    |    - index.js
|    + mod1/
|    |    + controller/
|    |    |    - DefaultController.js
|    |    |    - DefaultController.spec.js
|    |    + service/
|    |    + model/
|    |    - index.js
|    + mod2/
|    |    + controller/
|    |    + service/
|    |    |    - DefaultService.js
|    |    |    - DefaultService.spec.js
|    |    + model/
|    |    |    - Store.js
|    |    - index.js
+ db/
|    + migrations/
|    + models/
- package.json
- .env
- .gitignore
- README.md

```

### Description by directories
* **bin:** it contain the web server executable.
* **cfg:** it contain the configurations files, config.json for app configurations and core.json for framework.
* **src:** would be the source code that is grouped by modules, where the app should be the main module although this is not mandatory. Each module has a main file that responds to the actions of the module, this is composed as required by controllers, services, models, etc.
* **db:** it contain the models and migrations, it is not mandatory.

### Module design
The design of a module can be as complex or simple as it is needed, all its parts are not mandatory, but it is required the main class of the module and at least one controller is required to respond to the requests, even the controllers can be avoid and the module itself responds to HTTP requests, although the latter option is not recommended.

![Screenshot](doc/module.svg)



### Common example of module definition

```js
const KsMf = require('ksmf');
class Mod1Module extends KsMf.app.Module { }
module.exports = Mod1Module;

```

The modules define the behavior that they want to incorporate into the application, they record the controllers that will be used, as well as the routes that are associated with each action of each controller.

### Common example of controller definition
```js
const KsMf = require('ksmf');

class DefaultController extends KsMf.app.Controller {

    list(req, res) {
        res.json({ data: 'DefaultController-list' });
    }

    select(req, res) {
        res.end('DefaultController-select');
    }

    insert(req, res) {
        res.end('DefaultController-insert');
    }

    update(req, res) {
        res.end('DefaultController-update');
    }

    delete(req, res) {
        res.end('DefaultController-delete');
    }
}

module.exports = DefaultController;
```


### Adding custom controllers from Module
```js
const KsMf = require('ksmf');

class Mod2Module extends KsMf.app.Module {

    initConfig() {
        this.routes.push({ route: this.prefix + '/register', controller: 'RegisterController' });
        // ... for use DefaultController
        super.initConfig(); 
    }

}
module.exports = Mod2Module;

```
As in the previous example. to add a new controller, the *Module::initConfig* function must be redefined, specifying the path that responds to said controller. The *Module::prefix* property defines the prefix for the module routes but its use is not mandatory. By default each module defines the DefaultController controller, if you want to keep it you must call *super.initConfig()*


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
 -----------------------------------------------------
```

It is also possible to define new routes by modifying the *Module::initRoutesREST* or *Module::initRoutesWeb* being *initRoutesWeb* the recommended one in case you do not want to modify the rest of the RESTFull type routes and avoiding issues by not explicitly calling *super.initRoutesREST(opt)*


### Adding custom routes to a controller
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
 -----------------------------------------------------------
```

and for custom routes like the one in the previous example it would be:

```
-----------------------------------------------------------
 METHOD | URL PATH             | CONTROLLER ACTION
-----------------------------------------------------------
 GET      /person/fill           AddressController::fill
-----------------------------------------------------------
```

### Redefine Web App options 
Keep in mind that this framework is based on express in order to obtain its strengths and define a modular architecture. Therefore it is possible to modify the options of our application, redefining the method *Module::initApp*.

```js
const KsMf = require('ksmf');

class Mod2Module extends KsMf.app.Module {

    initApp() {

        this.web.use((err, req, res, next) => {
            this.setError(err, req, res, next);
        });

        this.web.use(express.json());

        super.initApp(); 
    }

}
module.exports = Mod2Module;

```

Note that the Module :: web property has the express app instance.

### Load Services or Libs
```js
const KsMf = require('ksmf');

class DefaultController extends KsMf.app.Controller {

    list(req, res) {
        const externalController = this.helper.get({
            name: 'AddressController',
            path: 'controller',
            module: 'person',
            options: {
                opt: this.opt,
                dao: this.dao
            },
            dependency: {
                'helper': 'helper'
            }
        });
        const data = externalController.list(req, res);
        res.json({ data });
    }
}

module.exports = DefaultController;
```

This microframework uses [KsDp](https://github.com/ameksike/ksdp) allowing you to make use of integration patterns such as the [IoC](https://github.com/ameksike/ksdp/wiki/IoC-from-Integration-Group), in this way you can access any library or service of the project without having to load it or explicitly intanciate it.
