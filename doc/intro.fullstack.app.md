In order to facilitate the creation of projects with the KsMf framework, its development team provides a public project template, which can be used as a base for creating applications, which can be accessed from the following [link](https://github.com/ameksike/ksmf-skeleton-web). This application prototype offers a general structure that allows you to create full stack projects. Note that a full stack application is one that contains both code that runs in web browsers with Graphical User Interfaces (GUI), and code that runs on the server to implement business logic.

- The code that is executed in web browsers to implement interaction with users through graphical interfaces, generally uses frameworks and libraries such as [Angular](https://angular.io/docs), [React](https://en.reactjs.org/docs/getting-started.html), [VueJs](https://vuejs.org/v2/guide/), [Bootstrap](https://getbootstrap.com/docs/5.1/getting-started/introduction/), etc.

- Usually the code that is executed on the server side implements the business logic of the problem that you're trying to automate, using styles and solution patterns such as [RESTful API](https://es.wikipedia.org/wiki/Transferencia_de_Estado_Representacional), [DDD](https://en.wikipedia.org/wiki/Domain-driven_design), [SOLID](https://es.wikipedia.org/wiki/SOLID), etc. It is also used to compose this type of solutions, frameworks such as [KsMf](https://github.com/ameksike/ksmf/wiki), [ExpressJs](https://expressjs.com/es/), [NextJs](https://nextjs.org/), etc.

## Install
- git clone https://github.com/ameksike/ksmf-skeleton-web.git
- mv ./ksmf-skeleton-web ./myproject   #... rename project folder
- cd myproject
- npm install 

## Develop
- npm run client:watch
- npm run dev

## Skeleton
Below you can see the general structure of a full stack project:
```
+ client/
+ server/
- LICENSE
- README.md
- package.json
- .gitignore
- .env
```

- **client:** This directory contains a classic application based on technologies such as Angular, React, VueJs, etc. For more information see [client description](https://github.com/ameksike/ksmf-skeleton-web/tree/main/client).
- **server:** This directory contains the source code that runs on the server side, it is usually associated with the web API (database access, remote endpoint access, business logic, etc.)
- **LICENSE:** Product license description file
- **package.json:** The package. json file is the heart of any Node project. It records important metadata about a project which is required before publishing to NPM, and also defines functional attributes of a project that npm uses to install dependencies, run scripts, and identify the entry point to our package.
- **.gitignore:** The .gitignore file tells Git which files to ignore when committing your project to the GitHub repository .gitignore is located in the root directory of your repo. The .gitignore file itself is a plain text document.
- **.env:** A .env file is a text file containing key value pairs of all the environment variables required by your application. This file is included with your project locally but not saved to source control so that you aren't putting potentially sensitive information at risk.

## Skeleton App
This framework provides different **Skeleton App** with the aim of speeding up the development of applications and facilitating it understanding. Note that, the term **Skeleton App** or **Boilerplate** refers to standardized text, copy, documents, methods, or procedures that may be used over again without making major changes to the original. A boilerplate is commonly used for efficiency and to increase the standardization of software development.

### Angular 
This framework provides a template to easily create a web application based on [Angular](https://angular.io/) and [Angular Material](https://material.angular.io/). It implements an example where three main entities are managed: Users, Tags and Comments. For more information about this project, see [Angular Web App Skeleton](https://github.com/ameksike/ksmf-skeleton-web-angular).

The next recomended topic: [Project Skeleton](./common.project.skeleton.md).