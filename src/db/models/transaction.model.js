var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const TransactionSchema = new mongoose.Schema({
    transaction_id: {
        type: Number,
    },
    transaction_date: {
        type: Date
    },
    transaction_value: {
        type: Number
    },
    transaction_description: {
        type: String
    },
    budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    sub_category: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
});


TransactionSchema.set('timestamps', true)

TransactionSchema.plugin(AutoIncrement, {
    inc_field: 'transaction_id',
    start_seq: 100000001,
    inc_amount: 1
})

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
