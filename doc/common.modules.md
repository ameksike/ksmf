### Module design
The design of a module can be as complex or simple as it is needed, all its parts are not mandatory, but it is required the main class of the module and at least one controller is required to respond to the requests, even the controllers can be avoided and the module itself responds to HTTP requests, although the latter option is not recommended.

### App module with Controller
The controllers must be the classes that are responsible for receiving client requests, processing parameters and giving a response. 
```
+ [PROJECT_PATH]/
|    + bin/
|    + cfg/
|    + src/
|    |    +    app/
|    |    |    -    index.js
|    |    |    +    controller/
|    |    |    |    -    DefaultController.js
|    - package.json
```

Update the main class of the **app** module by redefining the **init** method and specifying the details of the route that the default controller will serve. 
```js
const KsMf = require('ksmf');
class AppModule extends KsMf.app.Module {
    init() {
        this.routes = [
            {
                route: "/",
                controller: 'DefaultController',
                action: 'home',
                method: 'get'
            }
        ];
        super.init();
    }
}
module.exports = AppModule;
```

Create a controller class with a prototype similar to the one shown below: 
```js
const KsMf = require('ksmf');
class DefaultController extends KsMf.app.Controller {

    home(req, res) {
        res.end('Hello world from a Controller');
    }

}
module.exports = DefaultController;
```

Run your server at:
``` 
npm start
```

Finally, access from your web browser to the address: 
``` 
http://localhost:3030/ 
```

### Common example of module definition

```js
const KsMf = require('ksmf');
class PersonModule extends KsMf.app.Module { }
module.exports = PersonModule;

```

an example of the structure for the person module could be: 

```
+ [PROJECT_PATH]/
|    + bin/
|    + cfg/
|    + src/
|    |    +    app/
|    |    +    person/
|    - package.json
```

if we go into the person module, we could observe a structure like the following: 
```
+ person/
|    + config/
|    |    - routes.js
|    + controller/
|    |    - DefaultController.js
|    |    - DefaultController.spec.js
|    + service/
|    |    - DefaultService.js
|    + model/
|    |    - Person.js
|    - index.js
```


A slightly more complex design could be similar to the image shown below: 
![Screenshot](./resources/module.svg)

For more information on controllers see the section: **[Controllers](./common.controllers.md)**, also you can see [Data Base](./common.DAO.md) section.

### Configuration
The modules have a property called '**opt**' which contains the configuration data of the entire application, with a structure similar to the one shown below:
```js
{
  srv: {
    port: 3005,
    host: 'localhost',
    protocol: 'http',
    public: '../client/build/',
    static: '/',
    log: 2,
    module: {
      load: [Array],
      path: '/home/dev/myproject/src/'
    },
    event: {},
    helper: { error: [Object], logger: [Object], 'logger.class': [Object] },
    cors: []
  },
  cfg: { url: '', logging: true },
  env: {
    ALLUSERSPROFILE: '/home',
    COMPUTERNAME: 'ksike-server',
    HOME: 'home/dev',
    HOMEPATH: '/home/dev',
    NODE: '/bin/14.16/node',
    PROCESSOR_ARCHITECTURE: 'AMD64',
    PROCESSOR_IDENTIFIER: 'Intel64 Family 6 Model 60 Stepping 3, GenuineIntel',
    PROCESSOR_LEVEL: '6',
    PROCESSOR_REVISION: '3c03',
    SESSIONNAME: 'Console',
    TMP: '/tmp',
    URL_TERMINAL: 'http://localhost:3005',
    USERDOMAIN: 'ksike-server',
    USERDOMAIN_ROAMINGPROFILE: 'ksike-server',
    USERNAME: 'ksmf',
    USERPROFILE: 'home/dev',
  },
  envid: 'development',
  path: {
    prj: '/home/dev/myproject/',
    mod: '/home/dev/myproject/src/',
    app: '/home/dev/myproject/src/app/'
  },
  name: 'app'
}
```

The next recomended topic: [Controllers](./common.controllers.md).