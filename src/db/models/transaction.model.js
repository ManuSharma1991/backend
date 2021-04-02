var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const TransactionSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    transactionDate: {
        type: Date
    },
    transactionValue: {
        type: Number
    },
    transactionDescription: {
        type: String
    },
    transactionType: {
        type: String
    },
    budget: { type: Number, ref: 'Budget' },
    user: { type: Number, ref: 'User' },
    fromAccount: { type: Number, ref: 'Account' },
    toAccount: { type: Number, ref: 'Account' },
    category: { type: Number, ref: 'Category' },
    subCategory: { type: Number, ref: 'SubCategory' },
}, { _id: false });


TransactionSchema.set('timestamps', true)

// TransactionSchema.plugin(AutoIncrement, {
//     inc_field: 'transactionId',
//     start_seq: 100000001,
//     inc_amount: 1
// })

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
