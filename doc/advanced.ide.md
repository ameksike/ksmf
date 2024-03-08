Configuring Visual Studio Code for debugging is straightforward and can be done using the built-in debugger functionality. Here's a step-by-step guide:

1. Create a Launch Configuration File:
Click on the debug icon in the sidebar or press *Ctrl + Shift + D* to open the Debug view. Then, click on the gear icon (⚙️) to create a *launch.json* file. Select the environment or debugger you want to use. If the environment or debugger you need is not listed, you can create a custom configuration.

2. Configure Launch Configurations:
Inside the launch.json file, you can define different launch configurations for your project. Each configuration specifies how to run and debug your application. Common properties in a launch configuration include:

- "type": Specifies the type of debugger to use (e.g., "chrome" for debugging JavaScript in Chrome, "python" for debugging Python code).
- "request": Specifies how the debugger should start (e.g., "launch" to start debugging a new instance of your application, "attach" to attach the debugger to an already running application).
- "program": Specifies the entry point of your application (e.g., the path to your main script or executable).
- Additional properties specific to the chosen debugger or environment.

```js
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Web",
            "program": "${workspaceFolder}/node_modules/ksmf/bin/cli.js",
            "cwd": "${workspaceFolder}",
            "console": "integratedTerminal",
            "args": ["web"]
        },
        {
            "type": "node",
            "request": "launch",
            "name": "CLI",
            "program": "${workspaceFolder}/node_modules/ksmf/bin/cli.js",
            "cwd": "${workspaceFolder}",
            "console": "integratedTerminal",
            "args": ["run", "module"]
        },
        {
            "name": "Test",
            "type": "node",
            "request": "launch",
            "env": {
                "CI": "true"
            },
            "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/jest",
            "args": [
                "test",
                "--runInBand",
                "--no-cache"
            ],
            "cwd": "${workspaceRoot}",
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Jest debug current file",
            "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
            "args": [
              "--verbose",
              "-i",
              "--no-cache",
              "--testPathPattern",
              "${fileBasename}"
            ],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen"
          }
    ]
}
```

3. Set Breakpoints:
Place breakpoints in your code by clicking in the gutter next to the line number where you want to pause execution. When the debugger reaches a breakpoint, it will pause execution and allow you to inspect variables and step through the code.

4. Start Debugging:
Press F5 or click the green play button in the Debug view to start debugging using the currently selected launch configuration. Visual Studio Code will launch your application in debug mode, and you can interact with it as usual.

By following these steps, you can configure Visual Studio Code for debugging and effectively debug your applications.

### Related topics

- [Skeleton](./common.project_skeleton.md)
- [Web Server](./advanced.app_web.md)
- [Modules](./common.modules.md)
- [Settings](./advanced.setting.md)
- [Events](./advanced.events.md)

The next recomended topic: [Settings](./advanced.setting.md).
