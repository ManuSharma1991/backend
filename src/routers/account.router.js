const express = require("express");
const accountController = require("../controllers/account.controller");

const AccountRouter = express.Router();

AccountRouter.get('/getAccounts/:user', accountController.getAccounts);
AccountRouter.get('/getAccount/:id', accountController.getAccountById);
AccountRouter.post('/createAccount', accountController.createAccount);
module.exports = AccountRouter;
