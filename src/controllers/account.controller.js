const Account = require('../db/models/account.model');
const User = require('../db/models/user.model');

const getAccount = function getAccount(req, res, next) {
    Account.find()
        .populate('user')
        .then(account => {
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
        .then(account => {
            res.send(account);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

module.exports = { getAccount, createAccount, getAccountById }
