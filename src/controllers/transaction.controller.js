const Allocation = require("../db/models/allocation.model");
const Budget = require("../db/models/budget.model");
const Category = require("../db/models/category.model");
const SubCategory = require("../db/models/sub_category.model");
const Transaction = require("../db/models/transaction.model");
const AccountTransaction = require("../db/models/account_transaction.model");
const User = require("../db/models/user.model");
const mongoose = require('mongoose');
const Account = require("../db/models/account.model");

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

    Account.findOne(req.body.account)
        .then(account => {
            new_transaction.account = account._id
        });

    new_transaction.save(new_transaction)
        .then(async function (transaction) {
            await Allocation.findOne(
                {
                    user: mongoose.Types.ObjectId(transaction.user),
                    budget: mongoose.Types.ObjectId(transaction.budget),
                    category: mongoose.Types.ObjectId(transaction.category),
                    sub_category: mongoose.Types.ObjectId(transaction.sub_category)
                }
            )
                .then(allocation => {
                    allocation.spent_per_sub_category = allocation.spent_per_sub_category + transaction.transaction_value
                    if (allocation.spent_per_sub_category > allocation.allocated_per_sub_category) {
                        allocation.remaining_per_sub_category = 0
                    } else {
                        allocation.remaining_per_sub_category = allocation.allocated_per_sub_category - allocation.spent_per_sub_category
                    }
                    allocation.save();
                })
            // await createNewAccountTransaction(transaction)
            await debitAccountOnTransaction(transaction)
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
        .populate('budget', 'budgetId budgetName -_id')
        .populate('user', 'userId user_name -_id')
        .populate('category', ' category_id category_name -_id')
        .populate('sub_category', 'sub_category_id sub_category_name -_id')
        .populate('account', 'account_id account_name -_id')
        .then(transaction => {
            res.send(transaction);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

async function createNewAccountTransaction(transaction) {
    const transaction_data = await new Transaction(transaction)
        .populate('sub_category')
        .populate('account')
        .execPopulate()
    let new_account_transaction = new AccountTransaction({});

    Account.findOne(transaction_data.account)
        .then(account => {
            new_account_transaction.account = account._id
        });

    new_account_transaction.account_transaction_date = transaction_data.transaction_date
    new_account_transaction.account_transaction_value = transaction_data.transaction_value
    new_account_transaction.account_transaction_credited_to = transaction_data.sub_category.sub_category_name
    new_account_transaction.account_transaction_description = transaction_data.transaction_description
    await new_account_transaction.save(new_account_transaction)
        .then(async function (account_transaction) {
            // console.log(await account_transaction.populate('account').execPopulate());
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });

}

async function debitAccountOnTransaction(transaction) {
    const transaction_data = await new Transaction(transaction)
        .populate('sub_category')
        .populate('account')
        .execPopulate()
    Account.findOne(transaction_data.account)
        .then(async function (account) {
            account.account_spent_amount += transaction_data.transaction_value
            account.account_current_balance = account.account_initial_balance - account.account_spent_amount
            await account.save();
        });
}

module.exports = { recordTransaction, getTransactions }