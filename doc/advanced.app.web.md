### Redefine Web App options 
Keep in mind that this framework is based on express in order to obtain its strengths and define a modular architecture. Therefore, it is possible to modify the options of our application, redefining the method *Module::initApp*.

```js
const KsMf = require('ksmf');

class PersonModule extends KsMf.app.Module {

    initApp() {

        this.web.use((error, req, res, next) => {
            console.log(error);
        });

        super.initApp(); 
    }

}
module.exports = PersonModule;

```

Note that the *Module::web* property has the **[Express Js](https://expressjs.com/es/)** app instance.

### Related topics 
+ [Skeleton](./common.project.skeleton.md)
+ [Web Server](./advanced.app.web.md)
+ [Modules](./common.modules.md)
+ [Settings](./advanced.setting.md)
+ [Events](./advanced.events.md)

The next recomended topic: [CLI App](./advanced.app.cli.md).