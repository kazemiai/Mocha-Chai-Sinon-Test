const chai = require("chai");
const sinon = require("sinon");
const UserRepository = require("./user.repository");
const expect = chai.expect;
const faker = require("faker");
const UserService = require("./user.service");

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