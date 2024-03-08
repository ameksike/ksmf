A CLI (Command Line Interface) application is a type of software program that allows users to interact with it through a text-based interface in a command-line environment. CLI applications accept commands and arguments from the user and perform tasks accordingly. These applications are commonly used for tasks such as file manipulation, system administration, automation, and software development.

Advantages of CLI applications include:

- Efficiency: CLI applications can perform tasks quickly and efficiently, especially for repetitive or batch operations.
- Flexibility: CLI applications can be easily automated or scripted, allowing for complex workflows and integration with other tools.
- Resource Efficiency: CLI applications typically have lower resource requirements compared to graphical user interface (GUI) applications, making them suitable for use in resource-constrained environments.
- Remote Access: CLI applications can be accessed and used remotely over a network connection, making them ideal for server management and administration tasks.
- Portability: CLI applications can be run on a wide range of platforms and operating systems without modification, providing consistent behavior across different environments.

Now, let's discuss how to easily create a CLI application using the KsMf framework.

To create a CLI application using the KsMf framework, you can follow these steps:

1. Install the KsMf package via npm:

```
npm install ksmf
```

2. Create a directory named **src** in the root of your project.
3. Inside the **src** directory, create modules for your CLI application. Each module should consist of an **index.js** file defining the module's functionality.

```
./src/demo/index.js
```

```js
class Demo {
  process(app, param1, param2, param3) {
    console.log(arguments);
  }

  run(app, param1, param2, param3) {
    console.log(arguments);
  }
}
module.exports = Demo;
```

4. Implement actions within your modules that can be executed from the command line. By default, if no specific action is specified, the **run** action will be attempted.
5. To execute an action from the command line, use the following syntax:

```
npm ksmf run <module>:<action>  <param-1> <param-2> <param-n>
npm ksmf run demo:process       555       222       "same"
```

If no action is specified and you want to execute the default run action, the syntax would be:

```
npm ksmf run <module>  <param-1> <param-2> <param-n>
npm ksmf run demo      555       222       "same"
```

6. In either case, the module will receive as parameters an instance of **KsMf.app.CLI** followed by the specified parameters from the command line.

By following these steps and utilizing the KsMf framework, you can easily create powerful and efficient CLI applications with JavaScript. The modular structure of KsMf allows for flexible and scalable development, while the CLI functionality enables seamless interaction with users through the command line interface.

## Standard input and output

The standard input (stdin) and standard output (stdout) are fundamental concepts used in console or CLI (Command Line Interface) applications.

### Standard Output (stdout):

Standard output refers to the stream of data that a program sends to the outside world, typically to the user's screen or to another program. In CLI applications, stdout is where the program prints output or results for the user to see. The program writes output to stdout, which is then displayed in the terminal or console. In Node.js, stdout can be accessed using the process.stdout stream.

File: `./src/demo/index.js`

```js
class Demo {
  async run(app) {
    app.write("Hello world!");
  }
}
```

It is possible to specify the native driver for both the standard input and output.

File: `./src/demo/index.js`

```js
class Demo {
  async run(app) {
    app.write("Hello world!", {
      stdout: process.stdout,
      stdin: process.stdin,
    });
  }
}
```

### Standard Input (stdin):

Standard input refers to the stream of data that a program receives from the outside world, typically from the user via the keyboard or from another program. In CLI applications, stdin is where the user can input data or commands to be processed by the program. The program reads input from stdin and processes it accordingly. In Node.js, stdin can be accessed using the process.stdin stream.

File: `./src/demo/index.js`

```js
class Demo {
  async run(app) {
    let data = await app.read("Type your Name:");
    console.log(data);
  }
}
```

It is also possible to define a default value in case the user presses the enter key without specifying any value.
File: `./src/demo/index.js`

```js
class Demo {
  async run(app) {
    let data = await app.read("Type your Name:", {
      default: "Guess",
      stdout: process.stdout,
      stdin: process.stdin,
    });
    console.log(data);
  }
}
```

These standard streams provide a standardized way for CLI applications to interact with the user and the external environment. They allow programs to receive input, process it, and produce output, enabling users to interact with the application effectively through the command line interface.

## Reading and transformation of CLI parameters

Parameters for a CLI (Command Line Interface) application are values passed to the program when it is executed, providing additional information or instructions for the program to act upon. These parameters allow users to customize the behavior of the application without modifying its source code.

There are several common formats used to define parameters for CLI applications:

### Positional Parameters:

Positional parameters are specified by their position in the command line arguments. They do not have a specific flag or identifier, but their order determines their meaning. For example:

```
mycli parameter1 parameter2 parameter3
```

By default the parameters are received in the same order as specified through the CLI. Note that the first parameter will always be the application instance.

```js
class Demo {
  async run(app, param1, param2, param3) {
    console.log(
      param1 === "parameter1",
      param2 === "parameter2",
      param3 === "parameter3"
    );
  }
}
```

We can also reach the parameters using a method from the application instance.

```js
class Demo {
  async run(app) {
    // defining argument mapping based on order
    const param = app.params({
      order: {
        0: "arg1",
        1: "arg2",
        2: "arg3",
      },
    });

    console.log(
      param.arg1 === "parameter1",
      param.arg2 === "parameter2",
      param.arg3 === "parameter3"
    );
  }
}
```

### Named Parameters (Flags or Options):

Named parameters are specified using flags or options preceded by a hyphen or double hyphen. They are typically followed by a value or are boolean flags that indicate the presence of a feature. For example:

```
mycli --verbose --output=output.txt --mode=debug
```

The key of the argument allows access to the defined value, it is important to avoid spaces, in case a key does not have a defined value, a true value is adopted.

```js
class Demo {
  async run(app) {
    const param = app.params();
    console.log(
      param.verbose === true,
      param.output === "output.txt",
      param.mode === "debug"
    );
  }
}
```

### Short Options:

Short options are single-letter flags preceded by a single hyphen. They are often used for concise commands where a single letter represents a specific action or option. For example:

```
mycli -v -o=output.txt -m=debug
```
In a similar way to the previous method, the arguments are obtained:

```js
class Demo {
  async run(app) {
    const param = app.params();
    console.log(
      param.v === true,
      param.o === "output.txt",
      param.m === "debug"
    );
  }
}
```

Note how the arguments received per parameter contain both the key and the value:

```js
class Demo {
  async run(app, param1, param2, param3) {
    const param = app.params();
    console.log(
      param1 === "-v",
      param2 === "-o=output.txt",
      param3 === "-m=debug"
    );
  }
}
```
### Mixed Parameters:

CLI applications often support a combination of named parameters and positional parameters. This allows users to provide both specific options and positional arguments in the command line. For example:

```
mycli --verbose input.txt -m=debug output.txt
```

All the previous approaches can be combined: 
```js
class Demo {
  async run(app) {
    const param = app.params({
      order: {
        1: "input",
        4: "output",
      },
    });
    console.log(
      param.verbose === true,
      param.m === "debug",
      param.input === "input.txt",
      param.output === "output.txt"
    );
  }
}
```

These parameter formats provide flexibility and versatility for users to interact with CLI applications, allowing them to provide input, configure behavior, and customize output according to their needs.

### Related topics

- [Skeleton](./common.project_skeleton.md)
- [Web Server](./advanced.app_web.md)
- [Modules](./common.modules.md)
- [Settings](./advanced.setting.md)
- [Events](./advanced.events.md)
- [VS Code Debbug](./advanced.ide.md)

The next recomended topic: [Settings](./advanced.setting.md).
