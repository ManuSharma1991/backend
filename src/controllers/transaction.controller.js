const Transaction = require("../db/models/transaction.model");
const Account = require("../db/models/account.model");
const { getNextSequenceValue } = require("../utilities/helper_functions");



const getTransactionsOfAccount = async (req, res) => {
    try {
        const transactions = Transaction.find({ $or: [{ 'toAccount': req.params.account }, { 'fromAccount': req.params.account }] })
            .populate('budget', 'budgetId budgetName -_id')
            .populate({ path: 'subCategory', populate: { path: 'category' } })
            .populate('fromAccount')
            .populate('toAccount')
        res.send(transactions);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while fetching transactions."
        });
    }
}

const recordTransaction = async (req, res) => {
    try {
        const new_transaction = new Transaction(req.body);
        new_transaction._id = await getNextSequenceValue('transaction');

        const transaction = await new_transaction.save(new_transaction);
        await debitAccountOnTransaction(transaction);
        const transaction_data = await transaction
            .populate({ path: 'subCategory', select: '_id name type userCreated category', populate: { path: 'category', select: '_id name type userCreated' } })
            .populate('fromAccount', '_id name')
            .populate('toAccount', '_id name')
            .populate('budget', '_id')
            .execPopulate()
        res.send(transaction_data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating budget."
        });
    }
}

const debitAccountOnTransaction = async (transaction) => {
    if (transaction.type === 'income') {
        const toAccount = await Account.findById(transaction.toAccount);
        toAccount.balance += transaction.value;
        toAccount.total += transaction.value;
        await toAccount.save();
    }

    else if (transaction.type === 'expense') {
        const fromAccount = await Account.findById(transaction.fromAccount);
        fromAccount.spent += transaction.value;
        fromAccount.balance = fromAccount.balance - transaction.value;
        await fromAccount.save();

    }

    else if (transaction.type === 'transfer') {
        const toAccount = await Account.findById(transaction.toAccount);
        toAccount.balance += transaction.value;
        toAccount.total += transaction.value;
        await toAccount.save();

        const fromAccount = await Account.findById(transaction.fromAccount);
        fromAccount.total -= transaction.value;
        fromAccount.balance = fromAccount.balance - transaction.value;
        await fromAccount.save();
    }

}

module.exports = { recordTransaction, getTransactionsOfAccount, debitAccountOnTransaction }