const express = require("express");
const budgetController = require("../db/controllers/budget.controller");
let Budget = require("../db/models/budget.model");

const BudgetRouter = express.Router();

BudgetRouter.get('/getBudget', budgetController.getBudget);
BudgetRouter.post('/createBudget', budgetController.createBudget);
module.exports = BudgetRouter;
