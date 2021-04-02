const Account = require('../db/models/account.model');
const User = require('../db/models/user.model');
const Promise = require('bluebird');
const Transaction = require('../db/models/transaction.model');
const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const transactionController = require("../controllers/transaction.controller");
const { getNextSequenceValue } = require('../utilities/helper_functions');


const getAccount = function getAccount(req, res, next) {
    Account.find()
        .populate('user', '_id userName')
        .then(async function (account) {
            const resp = await Promise.each(account, async function (account_n) {
                await Transaction.find({ $or: [{ 'toAccount': account_n._id }, { 'fromAccount': account_n._id }] })
                    .then(async function (account_transaction_data) {
                        account_transaction_data.forEach(account_transaction => {
                            account_n.account_transaction.push(account_transaction);
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
    const new_account = new Account(req.body);
    new_account._id = await getNextSequenceValue("account")

    const new_transaction = new Transaction();
    new_transaction._id = await getNextSequenceValue("transaction")
    new_transaction.transactionDate = Date.now();
    new_transaction.transactionValue = new_account.accountBalance
    new_transaction.transactionDescription = 'Initial Amount'
    new_transaction.transactionType = 'income'
    new_transaction.fromAccount
    new_transaction.category = 1007;
    new_transaction.subCategory = 10015;
    new_transaction.user = new_account.user;

    new_account.accountTotal = 0
    new_account.accountBalance = 0

    new_account.save(new_account)
        .then(async function (account) {
            new_transaction.toAccount = account._id;

            await new_transaction.save(new_transaction)
                .then(async function (new_transaction) {
                    await transactionController.debitAccountOnTransaction(new_transaction)
                })

            await Account.findById(account._id).select('accountName _id')
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
    Account.findOne(req.body._id)
        .populate('user', '_id userName')
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
