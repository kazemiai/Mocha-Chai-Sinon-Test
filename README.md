# Unit Testing with Mocha, Chai, and Sinon Demo

## Source
https://blog.logrocket.com/unit-testing-node-js-applications-using-mocha-chai-and-sinon/

## Notes
The tutorial above skips some important steps and uses deprecated packages. This tutorial serves to update and improve upon the original while illustrating how to use Mocha, Chai, and Sinon for unit testing.

### 1. Start a new project

Before we can illustrate how to use these frameworks for unit testing, we will need a simple project that we can test!

Create a new directory for your project and navigate to that directory:

`mkdir mocha-chai-sinon-test && cd mocha-chai-sinon-test`

In this directory, you will create your `package.json` file that will be used to initialize your project and put the following details in the file (substituting your own information for `repository` and `author`):

```
{
  "name": "mocha-chai-sinon-test",
  "version": "1.0.0",
  "description": "Testing out unit testing using mocha, chai, and sinon",
  "main": "app.js",
  "repository": {
    "type": "git",
    "url": "git://github.com/kazemiai/Mocha-Chai-Sinon-Test.git"
  },
  "scripts": {
    "test": "mocha './src/**/*.test.js'",
    "start": "node src/app.js"
  },
  "keywords": [
    "mocha",
    "chai"
  ],
  "author": "Sara Kazemi",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.18.3",
    "dotenv": "^6.2.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.4.0",
    "morgan": "^1.9.1",
    "pg": "^7.12.1",
    "pg-hstore": "^2.3.3",
    "sequelize": "^6.5.0"
  },
  "devDependencies": {
    "chai": "^4.3.2",
    "mocha": "^8.2.1",
    "sinon": "^9.2.2",
    "faker": "^5.4.0"
  }
}
```

Notice the glob from the in the `scripts` section of `package.json`:

`"test": "mocha './src/**/*.test.js'"`

This tells Mocha to look for files ending with .test.js within the directories and subdirectories of the src folder. These will be the Mocha test files that we define later on, so it's important that we define how Mocha will locate them.

Notice: The modules we are using for unit testing are listed under `devDependencies`. The `devDependencies` are modules which are only required during development, while `dependencies` are modules which are also required at runtime. We will be using those modules to build a project with functionality that we can test!

Now, to install all the dependencies/dev dependencies we listed, we issue the command:

`npm install`

This installs all the specified modules (and their dependencies) in a newly created folder `node_modules`.


### 2. Create a simple testable project for demonstration
Our project will use a design pattern comprised of Models, Services, Controllers, and Respositories:

* **Model**: Represents an object. In our case, we will have one model to represent a User. 
* **Repository**: Performs database CRUD operations using data defined by one or more Models. For simplicity, our repository will just create and read User data.
* **Controller**: Contains application logic and returns a response (including status message and data as appropriate) to a Service.
* **Services**: The middleware between a Controller and Repository. Uses a response from a Controller, and, if successfully validated, will use that response to call upon the Repository to perform the appropriate CRUD operation.

