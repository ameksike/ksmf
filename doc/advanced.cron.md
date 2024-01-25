Cron is a tool that allows you to execute something on a schedule. This is typically done using the cron syntax. We allow you to execute a function whenever your scheduled job triggers. We also allow you to execute a job external to the JavaScript process using a child process. Additionally, this library goes beyond the basic cron syntax and allows you to supply a Date object. This will be used as the trigger for your callback. Cron syntax is still an acceptable CronTime format. Although the Cron patterns supported here extend to the standard Unix format to support seconds digits, leaving it off will default to 0 and match the Unix behavior.

```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │                                   7 is also Sunday on some systems)
# │ │ │ │ │
# │ │ │ │ │
# * * * * * <command to execute>
```

In order to facilitate the configuration, you can use tools such as [Crontab Guru](https://crontab.guru/).


### Install 
to use the cron component, you must install the dependency named node-cron 

```
npm install node-cron
```

### Configure
KsMf provides **cron** support through the subscription of events such as the **onInitConfig**, for more information see the [Events](./advanced.events.md) section, in this case, an entry from the cron wrapper must be added to the helper list.
```json
{
    "development": {
        "port": 3030,
        "host": "localhost",
        "protocol": "http",
        "log": 3,
        "module": {
            "load": [ "app" ]
        },
        "event": {
            "onInitConfig": [ "cron" ]
        },
        "helper": {
            "cron": {
                "name": "ksmf",
                "type": "lib",
                "namespace": "task.Cron",
                "dependency": {
                    "helper": "helper"
                }
            }
        },
        "cron": [
            {
		"env": "SCHEDULE_RETRIVE_DATA_DAILY",
		"value": "* * */1 * *",
		"target": {
			"type": "action",
			"module": "app",
			"name": "DefaultService",
			"action": "dailyProcessing"
		}
	   },
           {
		"value": "* * * */1 *",
		"target": {
			"type": "action",
			"module": "app",
			"name": "DefaultService",
			"action": "monthlyProcessing"
		}
	   }
        ]
    }
}
```

Notice how a new entry called cron is added in the general configuration of the environment, the config prototype is similar to the snippet shown below:  
```
"cron": [
	{
		"env": "SCHEDULE_RETRIVE_DATA_DAILY",
		"value": "* * */1 * *",
		"target": {
			"type": "action",
			"module": "app",
			"name": "DefaultService",
			"action": "dailyProcessing"
		}
	},
        {
		"value": "* * * */1 *",
		"target": {
			"type": "action",
			"module": "app",
			"name": "DefaultService",
			"action": "monthlyProcessing"
		}
	}
]
```
in this case, a list of elements to be executed in time is obtained
```
[
    {
       target: Object; [REQUIRED]
       value: String; [REQUIRED]
       env: String;  [OPTIONAL]
    }
]
```
+ **target:** represent an input to be loaded with the helper, generally it defines an action to be executed from a class belonging to a module, like services.
+ **value:** schedule value in **crontab** format
+ **env:** if it is specified, it will look for an environment variable with the specified name that contains the *schedule value in Crontab format*

### Related topics 
+ [Skeleton](./common.project_skeleton.md)
+ [Web Server](./advanced.app_web.md)
+ [Modules](./common.modules.md)
+ [Settings](./advanced.setting.md)
+ [Events](./advanced.events.md)

The next recomended topic: [Dashboard](./application.dashboard.md).

