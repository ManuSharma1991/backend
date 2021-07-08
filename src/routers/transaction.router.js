const express = require("express");
const transactionController = require("../controllers/transaction.controller");

const TransactionRouter = express.Router();

TransactionRouter.get('/getTransactionsOfAccount', transactionController.getTransactionsOfAccount);
// TransactionRouter.post('/getTransactionByMonth', transactionController.getTransactionByMonthAsRaw);
TransactionRouter.post('/recordTransaction', transactionController.recordTransaction);
module.exports = TransactionRouter;
