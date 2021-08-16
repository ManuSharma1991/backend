const express = require("express");
const userController = require("../controllers/user.controller");

const UserRouter = express.Router();

UserRouter.get('/getUsers', userController.getUsers);
UserRouter.get('/getUser/:id', userController.getUserById);
UserRouter.post('/createUser', userController.createUser);
UserRouter.post('/changeMode', userController.changeMode);
module.exports = UserRouter;
