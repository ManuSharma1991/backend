const Allocation = require("../db/models/allocation.model");
const Budget = require("../db/models/budget.model");
const Category = require("../db/models/category.model");
const SubCategory = require("../db/models/sub_category.model");
const Transaction = require("../db/models/transaction.model");
const User = require("../db/models/user.model");
const mongoose = require('mongoose');

const recordTransaction = function recordTransaction(req, res, next) {
    const new_transaction = new Transaction(req.body.transaction);

    User.findOne(req.body.user)
        .then(user => {
            new_transaction.user = user._id;
        });

    Budget.findOne(req.body.budget)
        .then(budget => {
            new_transaction.budget = budget._id
        });

    Category.findOne(req.body.category)
        .then(category => {
            new_transaction.category = category._id;
        });

    SubCategory.findOne(req.body.sub_category)
        .then(sub_category => {
            new_transaction.sub_category = sub_category._id;
        });

    new_transaction.save(new_transaction)
        .then(async function (transaction) {
            await transaction.populate().execPopulate();
            console.log(typeof (String(transaction.user)))
            await Allocation.findOne(
                {
                    user: mongoose.Types.ObjectId(transaction.user),
                    budget: mongoose.Types.ObjectId(transaction.budget),
                    category: mongoose.Types.ObjectId(transaction.category),
                    sub_category: mongoose.Types.ObjectId(transaction.sub_category)
                }
            )
                .then(allocation => {
                    console.log(allocation)
                    allocation.spent_per_sub_category = allocation.spent_per_sub_category + transaction.transaction_value
                    if (allocation.spent_per_sub_category > allocation.allocated_per_sub_category) {
                        allocation.remaining_per_sub_category = 0
                    } else {
                        allocation.remaining_per_sub_category = allocation.allocated_per_sub_category - allocation.spent_per_sub_category
                    }
                    allocation.save();
                })
            res.send(transaction);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });

}

const getTransactions = function getTransactions(req, res, next) {
    Transaction.find({}, '-__v -_id')
        .populate('budget', 'budget_id budget_name -_id')
        .populate('user', 'user_id user_name -_id')
        .populate('category', ' category_id category_name -_id')
        .populate('sub_category', 'sub_category_id sub_category_name -_id')
        .then(transaction => {
            res.send(transaction);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

module.exports = { recordTransaction, getTransactions }