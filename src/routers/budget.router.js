const express = require("express");
const budgetController = require("../controllers/budget.controller");
let Budget = require("../db/models/budget.model");

const BudgetRouter = express.Router();

BudgetRouter.get('/getBudget', budgetController.getBudget);
BudgetRouter.get('/getBudget/:id', budgetController.getBudgetById);
BudgetRouter.post('/createBudget', budgetController.createBudget);
module.exports = BudgetRouter;
