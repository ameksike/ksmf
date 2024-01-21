**Error Handling** refers to how **KsMf** catches and processes errors that occur both synchronously and asynchronously. **KsMf** comes with a default error handler, so you don’t need to write your own to get started.

# Custom Error Handler
Error handling is done by using the KsMf event handling system.

## Error event subscription
In the configuration file, you must specify the onError event and define the necessary handler for it:

```project/cfg/core.json```
```json
{
    "development": {
        "port": 3005,
        "host": "localhost",
        "protocol": "http",
        "public": "../client/build/",
        "static": "/",
        "log": 2,
        "module": {
            "load": [
                "person",
                "app"
            ]
        },
        "event": {
            "onError": [{
                "name": "ErrorHandler",
                "path": "middleware",
                "module": "app"
            }]
        },
        "helper": {
            "logger": {
                "name": "ksmf",
                "type": "lib",
                "namespace": "app.Logger"
            }
        }
    }
}
```

## Implement Custom Error Handler

For example, create a global file for the entire application that will implement the **onError** function. This function receives several parameters, among them, you can find the detected **error** object as well as the request and response objects to control everything you want to interrupt the flow and give a response to the client.

```project/src/app/middleware/ErrorHandler.js```

```js
class ErrorHandler {

    constructor(opt = null) {
        this.cfg = {
            level: 0
        };
    }

    onError(err, req = null, res = null, next = null) {
        res.status(500);
        return res.json({ "error": err.message });
    }
}
module.exports = ErrorHandler;
```

