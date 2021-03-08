const express = require("express");
const accountController = require("../controllers/account.controller");

const AccountRouter = express.Router();

AccountRouter.get('/getAccount', accountController.getAccount);
AccountRouter.post('/getAccountById', accountController.getAccountById);
AccountRouter.post('/createAccount', accountController.createAccount);
module.exports = AccountRouter;
