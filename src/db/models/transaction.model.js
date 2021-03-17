var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const TransactionSchema = new mongoose.Schema({
    transactionId: {
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
    budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
});


TransactionSchema.set('timestamps', true)

TransactionSchema.plugin(AutoIncrement, {
    inc_field: 'transactionId',
    start_seq: 100000001,
    inc_amount: 1
})

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
