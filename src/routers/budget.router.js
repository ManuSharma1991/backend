const express = require("express");
const budgetController = require("../controllers/budget.controller");

const BudgetRouter = express.Router();

BudgetRouter.get('/getBudgets/:user', budgetController.getBudgets);
BudgetRouter.get('/getBudget/:id', budgetController.getBudgetById);
BudgetRouter.post('/createBudget', budgetController.createBudget);
module.exports = BudgetRouter;
