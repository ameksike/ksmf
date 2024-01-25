The framework configuration is divided into two main files
+ [PROJECT_PATH]/cfg/config.json
+ [PROJECT_PATH]/cfg/core.json

**config.json** refers to the configuration elements at the application or business domain level, and **core.json** groups the configuration elements at the system level. Each of these configurations is grouped by runtime environments. Usually there are 3 main environments: _development_, _production_ and _test_, but you can define as many as you need.

### Core.json
+ **port:** web application server execution port 
+ **host:** web application server execution IP 
+ **protocol:** web application server execution protocol
+ **log:** log level status 
+ **route:** list of objects route type, see [Routes](./advanced.routes.md) 
+ **event:** objects list subscribed to events, see [Events](./advanced.events.md)
+ **helper:** objects list for inversion of control (IoC), see [KsDp / IoC](https://github.com/ameksike/ksdp/wiki/Integration-IoC)
+ **module:** options related to modules, such is the case of the load property that defines the list of modules to load 

Configuration example for a single environment in core config file
```json
{
        "port": 3031,
        "host": "localhost",
        "protocol": "http",
        "log": 3,
        "module": {
            "load": [ "demo", "app" ]
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
            "onInitConfig": ["dao.wrapper", "cron"],
            "onInitModules": ["dao.wrapper"],
        },
        "helper": {
            "cron": {
                "name": "ksmf",
                "type": "lib",
                "namespace": "task.Cron",
                "dependency": {
                    "helper": "helper"
                }
            },
        }
}
```

### Config.json
This configuration file is optional, and configuration options of this type are highly dependent on the domain of the particular solution to be developed. 

### Complete example of configuration with 3 environments

``` [PROJECT_PATH]/cfg/config.json ```
```json 
{
    "development": {
        "port": "5432",
        "host": "127.0.0.1",
        "database": "demodb",
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

``` [PROJECT_PATH]/cfg/core.json ```
```json
{
    "development": {
        "port": 3031,
        "host": "localhost",
        "protocol": "http",
        "log": 1,
        "module": {
            "load": [
                "demo",
                "app"
            ]
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
            "sequelize": {
                "name": "ksmf",
                "type": "lib",
                "namespace": "dao.Sequelize",
                "dependency": {
                    "helper": "helper"
                }
            },
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
        },
        "cron": [{
            "env": "SCHEDULE_RETRIVE_DATA",
            "value": "0/1 * * * *",
            "target": {
                "type": "action",
                "module": "etl",
                "name": "LoginService",
                "action": "dailyProcessing"
            }
        }]
    },
    "production": {
        "port": 3000,
        "host": "localhost",
        "protocol": "http",
        "log": 1,
        "module": {
            "load": [
                "demo",
                "app"
            ]
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
            "sequelize": {
                "name": "ksmf",
                "type": "lib",
                "namespace": "dao.Sequelize",
                "dependency": {
                    "helper": "helper"
                }
            },
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
        },
        "cron": [{
            "env": "SCHEDULE_RETRIVE_DATA",
            "value": "0/1 * * * *",
            "target": {
                "type": "action",
                "module": "etl",
                "name": "LoginService",
                "action": "dailyProcessing"
            }
        }]
    },
    "test": {
        "port": 3031,
        "host": "localhost",
        "protocol": "http",
        "log": 0,
        "module": {
            "load": [
                "demo",
                "app"
            ]
        },
        "route": {
            "/": {
                "method": "get",
                "module": "app",
                "controller": "DefaultController",
                "action": "home"
            }
        },
        "helper": {
            "Demo": {
                "name": "Crypto",
                "module": "app",
                "path": "service"
            },
            "dao": {
                "name": "DAOSequelize",
                "path": "service/DAO",
                "dependency": {
                    "helper": "helper"
                }
            }
        }
    }
}
```

### Related topics 
+ [Skeleton](./common.project_skeleton.md)
+ [Web Server](./advanced.app_web.md)
+ [Modules](./common.modules.md)
+ [Settings](./advanced.setting.md)
+ [Events](./advanced.events.md)

The next recomended topic: [Routes](./advanced.routes.md).