const Account = require('../db/models/account.model');
const AccountTransaction = require('../db/models/account_transaction.model');
const User = require('../db/models/user.model');
const Promise = require('bluebird');
const Transaction = require('../db/models/transaction.model');
const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const transactionController = require("../controllers/transaction.controller");


const getAccount = function getAccount(req, res, next) {
    Account.find()
        .populate('user')
        .then(async function (account) {
            const resp = await Promise.each(account, async function (account_n) {
                await AccountTransaction.find({ 'account': account_n._id })
                    .then(async function (account_transaction_data) {
                        account_transaction_data.forEach(async function (account_transaction) {
                            await account_n.account_transaction.push(account_transaction);
                        })
                    })
            })
            res.send(account);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}


const createAccount = async function createAccount(req, res, next) {
    const new_account = new Account(req.body.account);
    const new_transaction = new Transaction();

    new_transaction.transactionDate = Date.now();
    new_transaction.transactionValue = new_account.accountBalance
    new_transaction.transactionDescription = 'Initial Amount'
    new_transaction.transactionType = 'income'
    new_transaction.fromAccount

    await Category.findOne({ 'categoryId': 1001 })
        .then(category => {
            new_transaction.category = category._id;
        });

    await SubCategory.findOne({ 'subCategoryId': 10001 })
        .then(subCategory => {
            new_transaction.subCategory = subCategory._id;
        });


    User.findOne(req.body.user)
        .then(user => {
            new_account.user = user._id;
            new_transaction.user = user._id;
        });

    new_account.accountTotal = 0
    new_account.accountBalance = 0

    new_account.save(new_account)
        .then(async function (account) {
            new_transaction.toAccount = account._id;

            await new_transaction.save(new_transaction)
                .then(async function (new_transaction) {
                    await transactionController.debitAccountOnTransaction(new_transaction)
                })

            await Account.findById(account._id, 'accountId accountName -_id')
                .then(createdAccount => {
                    res.send(createdAccount);
                })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

const getAccountById = function getAccountById(req, res, next) {
    Account.findOne(req.body)
        .populate('user')
        .then(async function (account) {
            await Transaction.find({ $or: [{ 'toAccount': account._id }, { 'fromAccount': account._id }] })
                .then(async function (account_transaction_data) {
                    await account_transaction_data.forEach(account_transaction => {
                        account.account_transaction.push(account_transaction);
                    })
                })
            res.send(account);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

module.exports = { getAccount, createAccount, getAccountById }
