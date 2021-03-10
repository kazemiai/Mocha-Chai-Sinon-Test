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
Our project will use a design pattern comprised of Models, Repositories, Controllers, and Services:

* **Model**: Represents an object or entity. In our case, we will have one model to represent a User. 
* **Repository**: Performs database CRUD operations using data defined by one or more Models. For simplicity, our repository will just create and read User data.
* **Controller**: Contains application logic and returns a response (including status message and data as appropriate) to a Service.
* **Services**: The middleware between a Controller and Repository. Uses a response from a Controller, and, if successfully validated, will use that response to call upon the Repository to perform the appropriate CRUD operation.

Create a `user` folder in your project's `src` folder. This is where we will put our model, repository, controller, and service files, defined below:

#### `user.model.js`

```
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
class UserModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING
        }
      },
      {
        sequelize,
        modelName: "user"
      }
    );
  }
}

module.exports = UserModel;
```
#### `user.repository.js`
```
const { UserModel } = require("../database");
class UserRepository {
  constructor() {
    this.user = UserModel;
    this.user.sync({ force: true });
  }
  async create(name, email) {
    return this.user.create({
      name,
      email
    });
  }
  async getUser(id) {
    return this.user.findOne({ id });
  }
}
module.exports = UserRepository;
```
#### `user.controller.js`
```
class UserController {
    constructor(userService) {
      this.userService = userService;
    }
    async register(req, res, next) {
      const { name, email } = req.body;
      if (
        !name ||
        typeof name !== "string" ||
        (!email || typeof email !== "string")
      ) {
        return res.status(400).json({
          message: "Invalid Params"
        });
      }
      const user = await this.userService.create(name, email);
      return res.status(201).json({
        data: user
      });
    }
    async getUser(req, res) {
      const { id } = req.params;
      const user = await this.userService.getUser(id);
      return res.json({
        data: user
      });
    }
  }
  module.exports = UserController;
  ```
  #### `user.service.js`
  ```
  // The UserService class has two methods create and getUser. 
  const UserRepository = require("./user.repository");
  class UserService {
      constructor(userRepository) {
      this.userRepository = userRepository;
    }
  // The create method calls the create repository method passing name and email of a new user as arguments. 
  async create(name, email) {
    return this.userRepository.create(name, email);
    }

 // The getUser calls the repository getUser method.
 getUser(id) {
    return this.userRepository.getUser(id);
    }
  }
  module.exports = UserService;
```

We will also need to define some basic API routes to test the functionality of our model, repository, controller, and service. We will define these in `user.route.js`. Create this file in our `src/user` path:

#### `user.route.js`
```
const express = require("express");
const router = express.Router();
const UserController = require("./user.controller");
const UserRepository = require("./user.repository");
const UserService = require("./user.service");

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
module.exports = {
  userRepository,
  userService
};

const userController = new UserController(userService);

router.post("/user", (req, res) => userController.register(req, res));
router.get("/user/:id", (req, res) => userController.getUser(req, res));

module.exports = router;
```

To abstract away our database layer (in case we want to migrate to a different database later) for our repository to use, we will create a new folder named `database` in the `src` directory. In our `src/database` path, create the file `index.js` where we will define details used by `user.repository.js`.

#### `src/database/index.js`

```
const Sequelize = require("sequelize");
require("dotenv").config();
const enviroment = process.env;
const UserModel = require("../user/user.model");

const sequelize = new Sequelize(
  enviroment.DB_NAME,
  enviroment.DB_USER,
  enviroment.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres"
  }
);

const models = {
  UserModel: UserModel.init(sequelize, Sequelize)
};

const db = {
  ...models,
  sequelize
};

module.exports = db;
```

Finally, let's create the entry point for our application in `src/` named `app.js`.

#### `src/app.js`:

```
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./user/user.route");
const sequelize = require("./database").sequelize;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

const PORT = process.env.PORT || 5001;

app.use("/api/v1", router);
app.get("*", (req, res) => {
  res.status(404).json({ message: "Welcome to the begining of nothingness" });
});

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
```

### 3. Write the unit tests!

We will keep our unit tests organized away from our application code. Create a new folder named `test` in the `src` folder. We will write tests for our User repository, controller, and service. We are not testing our model, so a user entity will be stubbed out using `faker` and any model methods will be stubbed out using  `sinon`.

#### `user.repository.test.js`
```
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const { UserModel } = require("../database");
const UserRepository = require("../user/user.repository");


 // We use faker for the test fixtures
describe("UserRepository", function() {
  // stubbed out user entity
  const stubValue = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past()
  };

  // testing the create method of the UserRepository. 
  // Stubbing the UserModel.create method using Sinon. 
  // The stub is necessary because our goal is to test the repository and not the model. 
  describe("create", function() {
    it("should add a new user to the db", async function() {
      const stub = sinon.stub(UserModel, "create").returns(stubValue);
      const userRepository = new UserRepository();
      const user = await userRepository.create(stubValue.name, stubValue.email);
      expect(stub.calledOnce).to.be.true;
      expect(user.id).to.equal(stubValue.id);
      expect(user.name).to.equal(stubValue.name);
      expect(user.email).to.equal(stubValue.email);
      expect(user.createdAt).to.equal(stubValue.createdAt);
      expect(user.updatedAt).to.equal(stubValue.updatedAt);
    });
  });

  // To test the getUser method:
  // we have to also stub UserModel.findone. 
  // We use expect(stub.calledOnce).to.be.true to assert that the stub is called at least once. 
  // The other assertions are checking the value returned by the getUser method.
  describe("getUser", function() {
    it("should retrieve a user with specific id", async function() {
      const stub = sinon.stub(UserModel, "findOne").returns(stubValue);
      const userRepository = new UserRepository();
      const user = await userRepository.getUser(stubValue.id);
      expect(stub.calledOnce).to.be.true;
      expect(user.id).to.equal(stubValue.id);
      expect(user.name).to.equal(stubValue.name);
      expect(user.email).to.equal(stubValue.email);
      expect(user.createdAt).to.equal(stubValue.createdAt);
      expect(user.updatedAt).to.equal(stubValue.updatedAt);
    });
  });
});
```

Note: Model entities are stubbed out using `faker` and Model methods are stubbed out using `sinon`. `chai`'s `expect` method is used to write the actual assertions of these unit test cases for the UserRepository's `create`  and `getUser` methods.

#### `user.controller.test.js`
```
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const UserController = require("../user/user.controller");
const UserService = require("../user/user.service");
const UserRepository = require("../user/user.repository");

// In the first three it blocks, we are testing that a user will not be created when one or both of the required parameters (email and name) are not provided. 
// Notice that we are stubbing the res.status and spying on res.json

describe("UserController", function() {
    describe("register", function() {
      let status, json, res, userController, userService;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
        const userRepo = sinon.spy();
        userService = new UserService(userRepo);
      });
      it("should not register a user when name param is not provided", async function() {
        const req = { body: { email: faker.internet.email() } };
        await new UserController().register(req, res);
        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Invalid Params");
      });
      it("should not register a user when name and email params are not provided", async function() {
        const req = { body: {} };
        await new UserController().register(req, res);
        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Invalid Params");
      });
      it("should not register a user when email param is not provided", async function() {
        const req = { body: { name: faker.name.findName() } };
        await new UserController().register(req, res);
        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Invalid Params");
      });
      it("should register a user when email and name params are provided", async function() {
        const req = {
          body: { name: faker.name.findName(), email: faker.internet.email() }
        };
        const stubValue = {
          id: faker.random.uuid(),
          name: faker.name.findName(),
          email: faker.internet.email(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        };
        const stub = sinon.stub(userService, "create").returns(stubValue);
        userController = new UserController(userService);
        await userController.register(req, res);
        expect(stub.calledOnce).to.be.true;
        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(201);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].data).to.equal(stubValue);
      });
    });

      // For the getUser test we mocked on the json method. 
      // Notice that we also had to use a spy in place UserRepository while creating a new instance of the UserService.

    describe("getUser", function() {
      let req;
      let res;
      let userService;
      beforeEach(() => {
        req = { params: { id: faker.random.uuid() } };
        res = { json: function() {} };
        const userRepo = sinon.spy();
        userService = new UserService(userRepo);
      });
      it("should return a user that matches the id param", async function() {
        const stubValue = {
          id: req.params.id,
          name: faker.name.findName(),
          email: faker.internet.email(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        };
        const mock = sinon.mock(res);
        mock
          .expects("json")
          .once()
          .withExactArgs({ data: stubValue });
        const stub = sinon.stub(userService, "getUser").returns(stubValue);
        userController = new UserController(userService);
        const user = await userController.getUser(req, res);
        expect(stub.calledOnce).to.be.true;
        mock.verify();
      });
    });

  });
  ```

  #### `user.service.test.js`
  ```
  const chai = require("chai");
const sinon = require("sinon");
const UserRepository = require("../user/user.repository");
const expect = chai.expect;
const faker = require("faker");
const UserService = require("../user/user.service");

// test the UserService class methods 


//  test the UserService create method. We have created a stub for the repository create method
describe("UserService", function() {
  describe("create", function() {
    it("should create a new user", async function() {
      const stubValue = {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      };
      const userRepo = new UserRepository();
      const stub = sinon.stub(userRepo, "create").returns(stubValue);
      const userService = new UserService(userRepo);
      const user = await userService.create(stubValue.name, stubValue.email);
      expect(stub.calledOnce).to.be.true;
      expect(user.id).to.equal(stubValue.id);
      expect(user.name).to.equal(stubValue.name);
      expect(user.email).to.equal(stubValue.email);
      expect(user.createdAt).to.equal(stubValue.createdAt);
      expect(user.updatedAt).to.equal(stubValue.updatedAt);
    });
  });
});

// test the UserService getUser service method:

describe("UserService", function() {
    describe("getUser", function() {
      it("should return a user that matches the provided id", async function() {
        const stubValue = {
          id: faker.random.uuid(),
          name: faker.name.findName(),
          email: faker.internet.email(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        };
        const userRepo = new UserRepository();
        const stub = sinon.stub(userRepo, "getUser").returns(stubValue); // stubbing the UserRepository getUser 
        const userService = new UserService(userRepo);
        const user = await userService.getUser(stubValue.id);
        //and assert that the stub is called at least once and then assert that the return value of the method is correct.
        expect(stub.calledOnce).to.be.true; 
        expect(user.id).to.equal(stubValue.id);
        expect(user.name).to.equal(stubValue.name);
        expect(user.email).to.equal(stubValue.email);
        expect(user.createdAt).to.equal(stubValue.createdAt);
        expect(user.updatedAt).to.equal(stubValue.updatedAt);
      });
    });
  });
  ```

  ### Run the tests
  Now that we have written some unit tests to test our repository, controller, and service methods, we can run them by entering the following command in our project's root directory:
  
  `npm test`

  If all goes well, you should see all nine tests pass:

  ```
    UserController
    register
      ✓ should not register a user when name param is not provided
      ✓ should not register a user when name and email params are not provided
      ✓ should not register a user when email param is not provided
      ✓ should register a user when email and name params are provided
    getUser
      ✓ should return a user that matches the id param

  UserRepository
    create
      ✓ should add a new user to the db (39ms)
    getUser
      ✓ should retrieve a user with specific id

  UserService
    create
      ✓ should create a new user

  UserService
    getUser
      ✓ should return a user that matches the provided id


  9 passing (57ms)
  ```