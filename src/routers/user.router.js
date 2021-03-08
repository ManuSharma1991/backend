const express = require("express");
const userController = require("../controllers/user.controller");

const UserRouter = express.Router();

UserRouter.get('/getUser', userController.getUser);
UserRouter.post('/getUserById', userController.getUserById);
UserRouter.post('/createUser', userController.createUser);
module.exports = UserRouter;
