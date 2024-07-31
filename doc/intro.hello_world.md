To create our first example, the first thing to do should be to create the root directory of the project in [PROJECT_PATH], with the name that you consider most appropriate. 

Run the following command: 
```
npm init -y
```

The above command creates a dependency management file named ```[PROJECT_PATH] /package.json```, then proceed to create the main subdirectories of your project: cfg, src. 

Run the following commands:
- ``` npm install ksmf ```
- ``` npm install ksmf-express ```

It is recommended to create a first module in the **src** directory, it is usually called **app**. 
```
+ [PROJECT_PATH]/
|    + cfg/
|    + src/
|    |    +    app/
|    |    |    -    index.js
|    - package.json
```

Each module must have a main file named index.js by naming convention. You can use the following example to create your first module, which will be named as app following the above structure.
```js
module.exports = function (req, res) {
    res?.json({
        message: 'Hello-World',
        body: req.body,
        query: req.query,
        params: req.params,
        method: req.method
    });
}
```

Make sure your **package.json** include the start command in the script section.

```json
{
  "name": "demo.simple",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "npx ksmf web"
  },
  "dependencies": {
    "ksmf": "^1.3.32",
    "ksmf-express": "^1.2.2"
  }
}
```

Finally:
- Run in the terminal: ```npm start```
- Open in the web browser: ``` http://localhost:3003 ``` 

Alternatively, you can change the module structure to a class-based one like the following example:
```js
class AppModule {
    listen(req, res) {
        res.json({ 
            message: 'Hello-World',
            body: req.body, 
            query: req.query, 
            params: req.params, 
            method: req.method 
        });
    }
}
module.exports = AppModule;
```

This is a simple example, although it is recommended that client requests be managed in different controllers. For more information about Modules and Controllers, see the following [link](./common.modules.md).

### Related topics

- [Install](./intro.install.md)
- [VS Code Debbug](./advanced.ide.md)

The next recomended topic: [REST API Service](./intro.REST_API.md).
