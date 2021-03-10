const express = require("express");
const router = express.Router();
const UserController = require("./user.controller");
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

const userController = new UserController(userService);

router.post("/user", (req, res) => userController.register(req, res));
router.get("/user/:id", (req, res) => userController.getUser(req, res));

module.exports = router;