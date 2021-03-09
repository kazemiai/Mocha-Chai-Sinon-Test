
// The UserService class also has two methods create and getUser. 


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