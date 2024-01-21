To create our first example, the first thing to do should be to create the root directory of the project in [PROJECT_PATH], with the name that you consider most appropriate. 

Run the following command: 
```
npm init -y
```

The above command creates a dependency management file named ```[PROJECT_PATH] /package.json```, then proceed to create the main subdirectories of your project: bin, cfg, src. 

Run the following command:
```
npm install ksmf
```

It is recommended to create a first module in the **src** directory, it is usually called **app** or **home**. 
```
+ [PROJECT_PATH]/
|    + bin/
|    + cfg/
|    + src/
|    |    +    app/
|    |    |    -    index.js
|    - package.json
```

Each module must have a main file named index.js by naming convention. 
```js
const KsMf = require('ksmf');
class AppModule extends KsMf.app.Module {
    init(){
        this.app.get('/', (req, res, next) => {
           res.end('Hello-World');
        });
    }
}
module.exports = AppModule;
```

Make sure your **app** module is in the list of modules to load.

**[PROJECT_PATH]/cfg/core.json**
```
{
    "development": {
        "port": 3030,
        "host": "localhost",
        "protocol": "http",
        "log": 1,
        "module": {
            "load": [ "app" ]
        },
        "event": { },
        "helper": { 
            "error": {
                "name": "ksmf",
                "type": "lib",
                "namespace": "app.Error"
            },
            "logger": {
                "name": "ksmf",
                "type": "lib",
                "namespace": "app.Logger"
            }
        }
    }
}
```

Finally, access from your web browser to the address:
```
http://localhost:3030/
``` 

This is a simple example, although it is recommended that client requests be managed in different controllers. For more information about Modules and Controllers, see the following [link](./common.modules.md).

The next recomended topic: [REST API Service](./intro.REST.API.md).
