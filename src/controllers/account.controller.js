const Account = require('../db/models/account.model');
const User = require('../db/models/user.model');
const Transaction = require('../db/models/transaction.model');
const { getNextSequenceValue } = require('../utilities/helper_functions');


const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.params.user }).populate('user', '_id userName');
        res.send(accounts);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving accounts."
        });
    }
}


const createAccount = async (req, res) => {
    try {
        const new_account = new Account(req.body);
        new_account._id = await getNextSequenceValue("account");

        const user = await User.findById(new_account.user);
        if (user) {
            const new_transaction = new Transaction();
            new_transaction._id = await getNextSequenceValue("transaction");
            new_transaction.date = Date.now();
            new_transaction.value = new_account.balance;
            new_transaction.description = 'Initial Amount';
            new_transaction.type = 'income';
            new_transaction.toAccount = new_account._id;
            new_transaction.subCategory = 10001;
            new_transaction.user = user._id;

            const account = await new_account.save(new_account);
            user.accounts ? user.accounts.push(account._id) : user.accounts = [account._id];
            await user.save();
            await new_transaction.save(new_transaction);
            const result = await account.populate('transaction').execPopulate();
            res.send(result);
        } else {
            res.status(404).send({
                message: "User not found."
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating transaction."
        });
    }
}

const getAccountById = (req, res) => {
    try {
        const account = Account.findById(req.params.id).populate('user', '_id userName')
        res.send(account);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving account."
        });
    }
}

module.exports = { getAccounts, createAccount, getAccountById }
