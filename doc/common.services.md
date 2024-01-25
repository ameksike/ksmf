### Load Services or Libs
```js
const KsMf = require('ksmf');

class DefaultController extends KsMf.app.Controller {

    list(req, res) {
        const externalController = this.helper.get({
            name: 'AddressController',
            path: 'controller',
            module: 'person',
            options: {
                opt: this.opt
            },
            dependency: {
                'helper': 'helper'
            }
        });
        const data = externalController.list(req, res);
        res.json({ data });
    }
}

module.exports = DefaultController;
```

This microframework uses [KsDp](https://github.com/ameksike/ksdp) allowing you to make use of integration patterns such as the [IoC](https://github.com/ameksike/ksdp/wiki/IoC-from-Integration-Group), in this way you can access any library or service of the project without having to load it or explicitly intanciate it.

### Related topics 
+ [Modules](./common.modules.md)
+ [Test](./advanced.test.md)
+ [App](./advanced.app_web.md)
+ [Settings](./advanced.setting.md)

The next recomended topic: [Data Base](./common.DAO.md).