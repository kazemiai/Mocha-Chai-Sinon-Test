
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const { UserModel } = require("../database");
const UserRepository = require("../user/user.repository");


 // We use faker for the test fixtures
describe("UserRepository", function() {
  const stubValue = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past()
  };

  // testing the create method of the UserRepository. 
  // Stubbing the UserModel.create method. 
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



