# Unit Testing with Mocha, Chai, and Sinon Demo

## Source
https://blog.logrocket.com/unit-testing-node-js-applications-using-mocha-chai-and-sinon/

## Notes
The tutorial above skips some important steps and uses deprecated packages. This tutorial serves to update and improve upon the original while illustrating how to use Mocha, Chai, and Sinon for unit testing.

### Start a new project

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

Notice: The modules we are using for unit testing are listed under `devDependencies`. The `devDependencies` are modules which are only required during development, while `dependencies` are modules which are also required at runtime.

Now, to install all the dependencies/dev dependencies we listed, we issue the command:

`npm install`

This installs all the specified modules (and their dependencies) in a newly created folder `node_modules`.