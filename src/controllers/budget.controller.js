const Budget = require('../db/models/budget.model');
const User = require('../db/models/user.model');
const Allocation = require("../db/models/allocation.model");
const { getNextSequenceValue } = require('../utilities/helper_functions');
const { ER_1001_USER_NOT_FOUND, } = require('../utilities/constant_data');
const Transaction = require('../db/models/transaction.model');

const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.params.user }).populate('user', '_id userName');
        res.send(budgets);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving budget."
        });
    }
}

const getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id).populate('user', '_id userName');
        const transactions = await Transaction.find({ budget: budget._id }).populate('fromAccount').populate('toAccount').populate({ path: 'subCategory', populate: { path: 'category' } });
        const allocations = await Allocation.find({ budget: budget._id }).populate({ path: 'subCategory', populate: { path: 'category' } });
        budget.transactions = transactions;
        budget.allocations = allocations;
        if (budget) {
            res.send(budget);
        } else {
            res.status(404).send({
                message: "Budget not found."
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving budget."
        });
    }
}


const createBudget = async (req, res) => {
    try {
        const new_budget = new Budget(req.body);
        const user_exist = await User.findById(new_budget.user).populate({ path: 'category', populate: { path: 'subCategories' } });
        if (user_exist) {
            new_budget._id = await getNextSequenceValue("budget");
            new_budget.transactions = [];
            new_budget.allocations = [];
            const saved_budget = await new_budget.save(new_budget);
            user_exist.budgets.push(saved_budget._id);
            await user_exist.save();
            res.send(saved_budget);
        } else {
            res.status(500).send(ER_1001_USER_NOT_FOUND)
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

module.exports = { getBudgets, createBudget, getBudgetById }
