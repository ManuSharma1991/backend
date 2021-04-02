const Budget = require('../db/models/budget.model');
const User = require('../db/models/user.model');
const Allocation = require("../db/models/allocation.model");
const Transaction = require("../db/models/transaction.model");
const Promise = require('bluebird');
const { checkUser, getNextSequenceValue } = require('../utilities/helper_functions');
const { ER_1001_USER_NOT_FOUND, } = require('../utilities/constant_data');
const SubCategory = require('../db/models/subCategory.model');

const getBudget = function getBudget(req, res, next) {
    Budget.find()
        .populate('user', '_id userName')
        .then(async function (budget) {
            const resp = await Promise.each(budget, async function (budget_n) {
                await Allocation.find({ 'budget': budget_n._id })
                    .then(async function (budget_allocation_data) {
                        budget_allocation_data.forEach(async function (budget_allocation) {
                            await budget_allocation
                                .populate('budget', 'budgetName _id')
                                .populate('user', 'userName _id')
                                .populate('category', ' categoryName _id')
                                .populate('subCategory', 'subCategoryName _id').execPopulate()
                            await budget_n.allocation.push(budget_allocation);
                        })
                    })
                await Transaction.find({ 'budget': budget_n._id })
                    .then(async function (budget_transaction_data) {
                        budget_transaction_data.forEach(async function (budget_transaction) {
                            await budget_n.transaction.push(budget_transaction);
                        })
                    })
            })
            res.send(budget);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}


const createBudget = async function createBudget(req, res, next) {
    const new_budget = new Budget(req.body);
    new_budget._id = await getNextSequenceValue("budget")

    const user_exist = await checkUser(new_budget.user)

    if (user_exist) {
        new_budget.save(new_budget)
            .then(async function (budget) {
                await createAllocation(budget)
                res.send(budget);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving budget."
                });
            });
    } else {
        res.send(ER_1001_USER_NOT_FOUND)
    }


}

const getBudgetById = function getBudgetById(req, res, next) {
    Budget.findById(req.body._id)
        .populate('user', '_id userName')
        .then(async budget_n => {

            const budget_allocation_data = await Allocation.find({ $and: [{ 'budget': budget_n._id }, { 'user': budget_n.user._id }] })
            budget_allocation_data.forEach(async function (budget_allocation) {
                await budget_allocation
                    .populate('budget', 'budgetName _id')
                    .populate('user', 'userName _id')
                    .populate('category', ' categoryName _id')
                    .populate('subCategory', 'subCategoryName _id').execPopulate()
                await budget_n.allocation.push(budget_allocation);
            })

            const budget_transaction_data = await Transaction.find({ $and: [{ 'budget': budget_n._id }, { 'user': budget_n.user._id }] })
            budget_transaction_data.forEach(async function (budget_transaction) {
                await budget_n.transaction.push(budget_transaction);
            })
            res.send(budget_n);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

const createAllocation = async function createAllocation(budget) {
    console.log(budget.user)
    SubCategory.find({ user: budget.user })
        .then(async function (subCategoryData) {
            console.log(subCategoryData.length)
            await Promise.each(subCategoryData, async function (subCategory) {
                console.log(subCategory)
                let new_allocation = new Allocation({});
                new_allocation._id = await getNextSequenceValue("allocation")
                new_allocation.user = subCategory.user;
                new_allocation.category = subCategory.category;
                new_allocation.subCategory = subCategory;
                new_allocation.budget = budget
                new_allocation.allocationMonth = budget.createdAt.getMonth();
                new_allocation.remainingPerSubCategory = 0
                new_allocation.allocatedPerSubCategory = 0
                new_allocation.spentPerSubCategory = 0;
                await new_allocation.save(new_allocation)
            })
        })
}

module.exports = { getBudget, createBudget, getBudgetById }
