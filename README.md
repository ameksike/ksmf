# KsMf
Modular Microframework for create minimalistic web application or REST API.


## Project Skeleton

```
+ bin/
|----+ server.js
+ cfg/
|----+ config.json
|----+ core.json
+ src
|----+ app/
|    |----+ controller/
|    |    |----+ DefaultController.js
|    |    |----+ DefaultController.spec.js
|    |----+ service/
|    |----+ model/
|    |----+ index.js
|----+ mod1/
|    |----+ controller/
|    |    |----+ DefaultController.js
|    |    |----+ DefaultController.spec.js
|    |----+ service/
|    |----+ model/
|    |----+ index.js
|----+ mod2/
|    |----+ controller/
|    |----+ service/
|    |    |----+ DefaultService.js
|    |    |----+ DefaultService.spec.js
|    |----+ model/
|    |    |----+ Store.js
|    |----+ index.js
+ db/
|----+ migrations/
|----+ models/
+ package.json
+ .env
+ .gitignore
+ README.md

```


### Common example of module definition

```js
const KsMf = require('ksmf');
class Mod1Module extends KsMf.app.Module { }
module.exports = Mod1Module;

```

### Common example of controller definition
```js
const KsMf = require('ksmf');

class DefaultController extends KsMf.app.Controller {

    list(req, res) {
        res.json([]);
    }

    fill(req, res) {
        res.end('RegisterController-fill');
    }

    select(req, res) {
        res.end('RegisterController-select');
    }

    insert(req, res) {
        res.end('RegisterController-insert');
    }

    update(req, res) {
        res.end('RegisterController-update');
    }

    delete(req, res) {
        res.end('RegisterController-delete');
    }
}

module.exports = RegisterController;
```

### Adding custom controllers from Module
```js
const KsMf = require('ksmf');

class Mod2Module extends KsMf.app.Module {

    initConfig() {
        this.routes.push({ route: this.prefix + '/register', controller: 'RegisterController' });
        super.initConfig(); // ... for use DefaultController
    }

}
module.exports = Mod2Module;

```

### Adding custom routes to a controller
```js
const KsMf = require('ksmf');

class Mod2Module extends KsMf.app.Module {

    initConfig() {
        this.routes.push({ route: this.prefix + '/register', controller: 'RegisterController' });
        super.initConfig(); // ... for use DefaultController
    }

    initRoutesREST(opt) {
        if (opt.controller === 'RegisterController') {
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
module.exports = Mod2Module;

```


