var mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    date: {
        type: Date,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        ref: 'Budget'
    },
    fromAccount: {
        type: Number,
        ref: 'Account'
    },
    toAccount: {
        type: Number,
        ref: 'Account'
    },
    subCategory: {
        type: Number,
        ref: 'SubCategory'
    },
}, { _id: false });


TransactionSchema.set('timestamps', true)

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
