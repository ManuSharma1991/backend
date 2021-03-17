const Allocation = require("../db/models/allocation.model");
const Budget = require("../db/models/budget.model");
const Category = require("../db/models/category.model");
const SubCategory = require("../db/models/subCategory.model");
const Transaction = require("../db/models/transaction.model");
const AccountTransaction = require("../db/models/account_transaction.model");
const User = require("../db/models/user.model");
const mongoose = require('mongoose');
const Account = require("../db/models/account.model");

const recordTransaction = async function recordTransaction(req, res, next) {
    const new_transaction = new Transaction(req.body.transaction);

    await User.findOne(req.body.user)
        .then(user => {
            new_transaction.user = user._id;
        });

    await Budget.findOne(req.body.budget)
        .then(budget => {
            new_transaction.budget = budget._id
        });

    await Category.findOne(req.body.category)
        .then(category => {
            new_transaction.category = category._id;
        });

    await SubCategory.findOne(req.body.subCategory)
        .then(subCategory => {
            new_transaction.subCategory = subCategory._id;
        });
    await Account.findOne(req.body.toAccount)
        .then(account => {
            new_transaction.toAccount = account._id
        });
    await Account.findOne(req.body.fromAccount)
        .then(account => {
            new_transaction.fromAccount = account._id
        });



    new_transaction.save(new_transaction)
        .then(async function (transaction) {
            if (transaction.transactionType === 'expense') {
                await Allocation.findOne(
                    {
                        user: mongoose.Types.ObjectId(transaction.user),
                        budget: mongoose.Types.ObjectId(transaction.budget),
                        category: mongoose.Types.ObjectId(transaction.category),
                        subCategory: mongoose.Types.ObjectId(transaction.subCategory)
                    }
                )
                    .then(allocation => {
                        allocation.spentPerSubCategory = allocation.spentPerSubCategory + transaction.transactionValue
                        if (allocation.spentPerSubCategory > allocation.allocatedPerSubCategory) {
                            allocation.remainingPerSubCategory = 0
                        } else {
                            allocation.remainingPerSubCategory = allocation.allocatedPerSubCategory - allocation.spentPerSubCategory
                        }
                        allocation.save();
                    })
            }
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
        .populate('user', 'userId userName -_id')
        .populate('category', ' categoryId categoryName -_id')
        .populate('subCategory', 'subCategoryId subCategoryName -_id')
        .populate('account', 'accountId accountName -_id')
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
        .populate('subCategory')
        .populate('account')
        .execPopulate()
    let new_account_transaction = new AccountTransaction({});

    Account.findOne(transaction_data.account)
        .then(account => {
            new_account_transaction.account = account._id
        });

    new_account_transaction.account_transaction_date = transaction_data.transactionDate
    new_account_transaction.account_transaction_value = transaction_data.transactionValue
    new_account_transaction.account_transaction_credited_to = transaction_data.subCategory.subCategoryName
    new_account_transaction.account_transaction_description = transaction_data.transactionDescription
    await new_account_transaction.save(new_account_transaction)
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });

}

async function debitAccountOnTransaction(transaction) {
    const transaction_data = await new Transaction(transaction)
        .populate('subCategory')
        .populate('account')
        .execPopulate()


    if (transaction.transactionType === 'income') {
        await Account.findOne(transaction_data.toAccount)
            .then(async function (account) {
                account.accountBalance += transaction_data.transactionValue
                account.accountTotal += transaction_data.transactionValue
                await account.save();
            });
    }

    else if (transaction.transactionType === 'expense') {
        await Account.findOne(transaction_data.fromAccount)
            .then(async function (account) {
                account.accountSpent += transaction_data.transactionValue
                account.accountBalance = account.accountBalance - transaction_data.transactionValue
                await account.save();
            });

    }

    else if (transaction.transactionType === 'transfer') {
        await Account.findOne(transaction_data.toAccount)
            .then(async function (account) {
                account.accountBalance += transaction_data.transactionValue
                account.accountTotal += transaction_data.transactionValue
                await account.save();
            });
        await Account.findOne(transaction_data.fromAccount)
            .then(async function (account) {
                account.accountSpent += transaction_data.transactionValue
                account.accountBalance = account.accountBalance - transaction_data.transactionValue
                await account.save();
            });
    }

}

module.exports = { recordTransaction, getTransactions, debitAccountOnTransaction }