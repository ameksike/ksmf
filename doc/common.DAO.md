In computer software, a data access object (DAO) is a pattern that provides an abstract interface to some type of database or other persistence mechanism. By mapping application calls to the persistence layer, the DAO provides some specific data operations without exposing details of the database.

Currently, there is support for:
+ [Redis](https://github.com/ameksike/ksmf/blob/main/src/dao/DAORedis.js)
+ [Sequelize](https://github.com/ameksike/ksmf/blob/main/src/dao/DAOSequelize.js)

## Sequelize
[Sequelize](https://sequelize.org/master/index.html) is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.

The DAO section of the KsMf framework is an additional resource, so the dependencies are not included and must be installed manually. 

```
npm install --save sequelize
```

You'll also have to manually install the driver for your database of choice:

```
# One of the following:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
```

Example of configuring the DAO lib using Sequelize as a base

```
[PROJECT_PATH]/cfg/core.json
```
```json
{
    "development": {
        "port": 3030,
        "host": "localhost",
        "protocol": "http",
        "log": 2,
        "module": {
            "load": [ "app" ]
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
                "params": { "exclude": ["forest"] },
                "namespace": "dao.Wrapper",
                "dependency": {
                    "helper": "helper"
                }
            },
        }
    }
}
``` 

Example of a typical module with several models 
```
+ app/
|    + config/
|    |    - routes.js
|    + controller/
|    |    - DefaultController.js
|    + service/
|    |    - DefaultService.js
|    + model/
|    |    - Person.js
|    |    - Address.js
|    |    - Country.js
|    - index.js
```

Through the helper resource you can access the lib with DAO aliases
```js
const dao = this.helper('dao');
const model = dao.models['Person'];

const data = await model.create({
   'name': 'Smith',
   'age': 35,
   'sex': 'M'
});
```

Example of deleting a record by ID 
```js
const dao = this.helper('dao');
const model = dao.models['Country'];
const Sequelize = dao.manager;

const result = await model.destroy({
	where: {
		"id": {
			[Sequelize.Op.eq]: id
		}
	}
});
```

### DAO Sequelize Instance
+ **dao.models** contains a list with all the loaded models associated with a nominal identifier. 
+ **dao.manager** contains the *require('sequelize')*
+ **dao.driver** contains an instance of Sequelize.

For more information on the use of Sequelize see the following [link](https://sequelize.org/master/manual/model-basics.html).

Another important aspect is that in the case of data access, application-level configurations are required, these configurations are stored in a separate file located in _config.json_, Below is an example for the use of the Postgre SQL database:
```
[PROJECT_PATH]/cfg/config.json
```
```json
{
    "development": {
        "port": "5432",
        "host": "127.0.0.1",
        "database": "my_db_local",
        "username": "postgres",
        "password": "postgres",
        "dialect": "postgres",
        "protocol": "postgres"
    },
    "production": {
        "use_env_variable": "DATABASE_URL",
        "dialect": "postgres",
        "dialectOptions": {
            "ssl": {
                "rejectUnauthorized": false
             }
        }
    },
    "test": {
        "dialect": "sqlite",
        "protocol": "sqlite",
        "storage": ":memory:",
        "logging": false
    }
}
```

### CLI for Sequelize 

Make sure you have [Sequelize](https://sequelize.org/) installed. Then install the Sequelize CLI to be used in your project with
```
npm install --save-dev sequelize-cli
```

And then you should be able to run the CLI with
```
npx sequelize --help
```

The command line interface can be improved by adding the following to the **[PROJECT_PATH]/package.json** file in scripts section:
```json
{
  "name": "demo.app",
  "version": "1.0.0",
  "description": "my demo app",
  "main": "index.js",
  "scripts": {
    "start": "node ./bin/server.js",
    "dev": "nodemon ./bin/server.js",

    "test": "jest",
    "test:match": "jest -t",

    "db:migrate": "npx sequelize-cli db:migrate",
    "db:migrate:undo": "npx sequelize-cli db:migrate:undo",
    "db:migrate:status": "npx sequelize-cli db:migrate:status",
    "db:migrate:generate": "npx sequelize-cli migration:generate --name",
    "db:migration:generate": "npx sequelize-cli migration:generate --name",

    "heroku-postbuild": "node_modules/.bin/sequelize db:migrate"
  },
  "keywords": [
    "shorter"
  ],
  "author": "KsMf Team",
  "license": "ISC",
  "dependencies": {
    "ksmf": "^1.0.37"
  },
  "devDependencies": {
    "jest": "^26.6.3",
    "nodemon": "^2.0.7",
    "sqlite3": "^5.0.2",
    "supertest": "^6.1.3"
  }
}
``` 
These commands represent simple shortcuts to the *sequelize-cli* tool, for more information see the following [link](https://github.com/sequelize/cli#documentation). 

### Models
Models are the essence of Sequelize. A model is an abstraction that represents a table in your database. In Sequelize, it is a class that extends Model. The model tells Sequelize several things about the entity it represents, such as the name of the table in the database and which columns it has (and their data types). A model in Sequelize has a name. This name does not have to be the same name of the table it represents in the database. Usually, models have singular names (such as User) while tables have pluralized names (such as Users), although this is fully configurable. For more information, access the following [link ](https://sequelize.org/master/manual/model-basics.html)

```
+ bin/
+ cfg/
|    - config.json
|    - core.json
+ src/
|    + app/
|    |    + controller/
|    |    + service/
|    |    + model/
|    |    |    - Person.js
|    |    |    - Address.js
|    |    - index.js
+ db/
|    + migrations/
|    |    - 20210820021134-create-company.js
|    |    - 20210820021134-create-person.js
|    |    - 20210820021134-create-address.js
|    + models/
|    |    - Company.js
- package.json
```
Note that in a typical project you can have the models centralized in the directory *'db/models/'* as well as the migrations in *'db/migrations/'* or have the models organized by each module in the directory *'src/[module-name]/model/'* as is the case of the app module in the previous example. 

```js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    static associate(models) {
      // define association here
    }
  };
  Person.init({
    source: DataTypes.STRING,
    base: DataTypes.STRING,
    state: DataTypes.INTEGER,
    type: { type: DataTypes.INTEGER, defaultValue: 1 },
    ownerId: DataTypes.UUID,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'person',
  });
  return Person;
};
```

The previous example shows the code of a typical model, this can also be generated automatically with its respective migration by executing the command shown below:
 
```
npx sequelize-cli model:generate --name Person --attributes source:string,base:string,state:integer,ownerId:uuid
```

### Migrations
Just like you use version control systems such as Git to manage changes in your source code, you can use migrations to keep track of changes to the database. With migrations you can transfer your existing database into another state and vice versa: Those state transitions are saved in migration files, which describe how to get to the new state and how to revert the changes in order to get back to the old state. For more information, access the following [link ](https://sequelize.org/master/manual/migrations.html)

KsMf offers useful functions that allow you to modify the database, in this case there are the **addColumn** and **removeColumn** functions, which unlike the native functions of Sequelize, these verify if they exist or not avoiding throwing an error, see example below 

Run the command 
```
npm run db:migrate:generate add
```

This will create a file similar to the one shown below: ```[PROJECT_PATH]/db/migrations/20210820153551-add.js```
```js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => { },
  down: async (queryInterface, Sequelize) => { }
};
```

Allowing it to be modified in this way in order to add a field called *'demo'* to the *'Person'* table: 

```js
'use strict';

const { addColumn, removeColumn } = require('ksmf').dao.Sequelize;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return addColumn(queryInterface, Sequelize, 'persons', 'demo', { 
      type: Sequelize.STRING, 
      allowNull: true 
    });
  },

  down: async (queryInterface, Sequelize) => {
    return removeColumn(queryInterface, 'persons', 'demo');
  }
};
```

To apply the changes, run the command: 
```
npm run db:migrate
```

To remove the changes, run the command: 
```
npm run db:migrate:undo
```

### Related topics 
+ [Modules](./common.modules.md)
+ [Cotrollers](./common.controllers.md)
+ [App](./advanced.app_web.md)
+ [Settings](./advanced.setting.md)

The next recomended topic: [Test](./advanced.test.md).