const Account = require('../db/models/account.model');
const AccountTransaction = require('../db/models/account_transaction.model');
const User = require('../db/models/user.model');
const Promise = require('bluebird');

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


const createAccount = function createAccount(req, res, next) {
    const new_account = new Account(req.body.account);

    User.findOne(req.body.user)
        .then(user => {
            new_account.user = user._id;
        });

    new_account.save(new_account)
        .then(account => {
            res.send(account);
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
            await AccountTransaction.find({ 'account': account._id })
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
