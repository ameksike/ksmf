
### Create project
Note that KsMf is public in the [npm](https://www.npmjs.com/package/ksmf) repository, which facilitates its installation and distribution.

```
cd [PROJECT_PATH]
npm init 
npm install ksmf
```

### Create Web Server 
it is recommended to create a file named server.js in the bin directory.
```
+ [PROJECT_PATH]/
|    + bin/
|    |    - server.js
|    + cfg/
|    + src/
|    - package.json
```

Server code example **[PROJECT_PATH]/bin/server.js**
```js
const KsMf = require('ksmf');
const app = new KsMf.app.WEB(__dirname + "/../");
module.exports = app.init().run();
```
For more information about the web server, see the following [link](https://github.com/ameksike/ksmf/wiki/Web-Server).

### Create initial config 
it is recommended to create a file named core.json in the cfg directory.
```
+ [PROJECT_PATH]/
|    + bin/
|    + cfg/
|    |    - core.json
|    + src/
|    - package.json
```

Core config example **[PROJECT_PATH]/cfg/core.json**
```
{
    "development": {
        "port": 3030,
        "host": "localhost",
        "protocol": "http",
        "log": 1,
        "module": {
            "load": [ ]
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

For more information about the configuration options of the framework, see the following [link](https://github.com/ameksike/ksmf/wiki/Setting).

Modify the **scripts** option in the **package.json** file to include the option to run the server. 
Package config example **[PROJECT_PATH]/package.json**
```
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "main": "./bin/server.js",
  "scripts": {
    "test": "jest",
    "start": "node ./bin/server.js"
  },
  "author": "Ksike Demo",
  "license": "ISC",
  "dependencies": {
    "ksmf": "^1.0.32"
  }
}
```

### Run project
```
npm start
```


### Related topics

- [Hello World](./intro.hello_world.md)
- [VS Code Debbug](./advanced.ide.md)

Ok you already have the framework installed, now you need to see the next topic [Hello World](./intro.hello_world.md) tutorial.