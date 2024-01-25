KsMf defines a series of events that are emitted at different points in the application, which are described below:

### Sequential events list when starting the application
1. onInitConfig
2. onInitApp
3. onInitModules
4. onLoadModule
5. onInitRoutes
6. onLoadRoutes
7. onStart

### Other Events 
* onStop
* on404
* onError

These events are configured in the core.json in the events section.

Event subscription example

```json
{
    "development": {
        "port": 3031,
        "host": "localhost",
        "protocol": "http",
        "log": 1,
        "module": {
            "load": [ "app" ]
        },
        "route": {
            "/": {
                "method": "get",
                "module": "app",
                "controller": "DefaultController",
                "action": "home"
            }
        },
        "event": {
            "onInitConfig": ["dao.wrapper"],
            "onInitModules": ["dao.wrapper"],
            "onLoadModule": ["dao.wrapper"]
        },
        "helper": {
            "dao": {
                "name": "ksmf",
                "type": "lib",
                "namespace": "dao.Sequelize",
                "dependency": {
                    "helper": "helper"
                }
            },
            "dao.wrapper": {
                "name": "ksmf",
                "type": "lib",
                "namespace": "dao.Wrapper",
                "dependency": {
                    "helper": "helper"
                }
            },
        }
    }
}
```

### Event onInitConfig
Event that is executed when initializing the application, once the main configuration elements are loaded 

```
[PROJECT_PATH]/cfg/core.json
```
```js
{
    "development": {
        "port": 3030,
        "host": "localhost",
        "protocol": "http",
        "log": 3,
        "module": {
            "load": [
                "app"
            ]
        },
        "event": {
            "onInitConfig": [
                {
                    "name": "DefaultService",
                    "module": "app"
                }
            ]
        },
        "helper": {}
    }
}
```

```
[PROJECT_PATH]/src/app/service/DefaultService.js
```

```js
class DefaultService {

    onInitConfig(config){
        console.log(config);
    }
}
module.exports = DefaultService;
```
This event receives by parameter a configuration object which is composed of the following properties:
onInitConfig
+ **envid:** String; environment identifier: development, production, test, etc
+ **env:** Object; group all environment variables 
+ **srv:** Object; groups all the configuration variables of the kernel of the system located in the file *[PROJECT_PATH]/cfg/core.json* 
+ **app:** Object; groups all the configuration variables of the kernel of the app located in the file *[PROJECT_PATH]/cfg/config.json* 

### Related topics 
+ [Skeleton](./common.project_skeleton.md)
+ [Web Server](./advanced.app_web.md)
+ [Modules](./common.modules.md)
+ [Settings](./advanced.setting.md)
+ [Events](./advanced.events.md)

The next recomended topic: [Middleware](./advanced.middleware.md).