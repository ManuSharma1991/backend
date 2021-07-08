const express = require("express");
const allocationController = require("../controllers/allocation.controller");

const AllocationRouter = express.Router();

AllocationRouter.get('/getAllocations', allocationController.getAllocations);
AllocationRouter.post('/getAllocationsByMonth', allocationController.getAllocationsByMonthAndBudget);
AllocationRouter.post('/createAllocation', allocationController.createAllocation);
module.exports = AllocationRouter;
