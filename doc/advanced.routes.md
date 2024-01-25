Routing refers to how an application’s endpoints (URIs) respond to client requests. For an introduction to routing, .
Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, PUT, and so on). For an introduction to routing, see [basic routing](https://expressjs.com/en/starter/basic-routing.html).

### Module
The routes are defined from the main interface of the module definition, through a property called **'routes'**, which consists of a list of routes, each of these routes is defined as an object whose properties are described below:

- **route:** string data type, defines the URL to which a controller and an action are associated.
- **controller:** string data type, defines the name of the controller class that implements the action that responds to the 'path' property, see [controllers](https://github.com/ameksike/ksmf/wiki/Controllers) section. 
- **action:** string data type, defines the name of the function within the controller class that responds to the url defined in the 'path' property 
- **method:** string data type, defines type of action, usually matches the HTTP request method (get, post, put, delete, options), although there is also 'all' that applies to any HTTP method, as well as the value 'rest' that defines the classic behavior of a controller of type REST allowing to omit the rest of the options.
- **middleware:** object data type, where each index must coincide with the action of the controller and the value of each index corresponds to a list of middleware functions, for a better understanding see the [middleware](https://github.com/ameksike/ksmf/wiki/Middleware) section. 

```js
const KsMf = require('ksmf');
class PersonModule extends KsMf.app.Module {

    initConfig() {
        this.routes = [
            {
                route: "/api/person",
                controller: 'PersonController',
                action: 'list',
                method: 'get'
            },{
                route: "/api/person/:id",
                controller: 'PersonController',
                action: 'select',
                method: 'get'
            },
            {
                route: "/api/person/",
                controller: 'PersonController',
                action: 'insert',
                method: 'post',
                middleware: {
                    insert: [(req, res, next) => {
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
module.exports = PersonModule ;
```
In the previous example, three routes are registered and associated with actions of a controller named PersonController:
```
GET https://my.domain.com/api/person

PersonController::list(req, res, next);
``` 
```
GET https://my.domain.com/api/person/125

PersonController::select(req, res, next);
``` 
```
POST https://my.domain.com/api/person

PersonController::insert(req, res, next);
``` 
Notice how a middleware is defined in the last route, for a better understanding of this topic see [middleware](https://github.com/ameksike/ksmf/wiki/Middleware) and [module](https://github.com/ameksike/ksmf/wiki/Modules) sections.

### REST
To simplify the handling of requests in the routing process itself, the KsMf framework provides the [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) type controller which brings a predefined route model and in correspondence with the REST specification. 
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
An example of how to register such a controller would be: 
```js
const KsMf = require('ksmf');
class PersonModule extends KsMf.app.Module {

    initConfig() {
        this.routes = [
            {
                route: "/api" + this.prefix,
                controller: 'DefaultController',
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
module.exports = PersonModule ;
```

See the sections on [controllers ](./common.controllers.md) and [middleware](./advanced.middleware.md). In case of developing a REST API, it is recommended to evaluate the deployment of your service through libraries such as [KsWc](https://github.com/ameksike/kswc/wiki). 

### Related topics 
+ [Skeleton](./common.project_skeleton.md)
+ [Web Server](./advanced.app_web.md)
+ [Modules](./common.modules.md)
+ [Settings](./advanced.setting.md)
+ [Events](./advanced.events.md)

The next recomended topic: [Events](./advanced.events.md).