const express = require("express");
const allocationController = require("../controllers/allocation.controller");

const AllocationRouter = express.Router();

AllocationRouter.get('/getAllocation', allocationController.getAllocation);
AllocationRouter.post('/getAllocationByMonth', allocationController.getAllocationByMonthAndBudget);
AllocationRouter.post('/createAllocation', allocationController.createAllocation);
module.exports = AllocationRouter;
