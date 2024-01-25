## WEB API
This is a common structure for a KsMf WEB API project:

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
* **bin:** it contains the web server executable, see section: [Web Server](./advanced.app_web.md).
* **cfg:** it contains the configurations files, config.json for app configurations and core.json for framework, see section: [Setting](./advanced.setting.md).
* **src:** would be the source code that is grouped by modules, where the app should be the main module although this is not mandatory. Each module has a main file that responds to the actions of the module, this is composed as required by controllers, services, models, etc, see section: [Modules](./common.modules.md).
* **db:** it contains the models and migrations, it is not mandatory, see section: [Data Base / DAO](./common.DAO.md).

## Full Stack App
This is a common structure for a KsMf WEB Full Stack App:
```
- client 
|	+ build
|	+ public
|	+ src
|	- package.json
|	- README.md
- server	
|	+ bin/
|	|    - server.js
|	+ cfg/
|	|    - config.json
|	|    - core.json
|	+ src/
|	|    + app/
| 	|    |    + controller/
|	|    |    |    - DefaultController.js
|	|    |    |    - DefaultController.spec.js
|	|    |    + service/
|	|    |    + model/
|	|    |    - index.js
|	|    + mod1/
|	|    + mod2/
|	+ db/
|	|    + migrations/
|	|    + models/
- package.json
- .env
- .gitignore
- README.md
```
### Description by directories
* **client:** the client directory can contain an entire project created with technologies such as [React](https://en.reactjs.org/docs/getting-started.html), [Angular](https://angular.io/start) or [Vue.js](https://vuejs.org/v2/guide/).
* **server:** the server directory contains a structure similar to the one described in the web API skeleton chapter.

The next recomended topic: [Modules](./common.modules.md).