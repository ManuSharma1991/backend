const Budget = require('../db/models/budget.model');
const User = require('../db/models/user.model');
const Allocation = require("../db/models/allocation.model");
const Transaction = require("../db/models/transaction.model");
const Promise = require('bluebird');
const { checkUser } = require('../utilities/helper_functions');
const { ER_1001_USER_NOT_FOUND } = require('../utilities/constant_data');

const getBudget = function getBudget(req, res, next) {
    Budget.find()
        .populate('user')
        .then(async function (budget) {
            const resp = await Promise.each(budget, async function (budget_n) {
                await Allocation.find({ 'budget': budget_n._id })
                    .then(async function (budget_allocation_data) {
                        budget_allocation_data.forEach(async function (budget_allocation) {
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
    const new_budget = new Budget(req.body.budget);
    const user_exist = await checkUser(req.body.user)

    if (user_exist) {
        User.findOne(req.body.user)
            .then(user => {
                new_budget.user = user._id;
            });

        new_budget.save(new_budget)
            .then(budget => {
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
    Budget.findOne(req.body)
        .populate('user')
        .then(budget => {
            res.send(budget);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

module.exports = { getBudget, createBudget, getBudgetById }
