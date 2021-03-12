var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AccountTransactionSchema = new mongoose.Schema({
    account_transaction_id: {
        type: Number,
    },
    account_transaction_date: {
        type: Date,
        required: true
    },
    account_transaction_value: {
        type: Number,
        required: true
    },
    account_transaction_credited_to: {
        type: String
    },
    account_transaction_description: {
        type: String
    },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
});


AccountTransactionSchema.set('timestamps', true)

AccountTransactionSchema.plugin(AutoIncrement, {
    inc_field: 'account_transaction_id',
    start_seq: 10000001,
    inc_amount: 1
})

const AccountTransaction = mongoose.model("AccountTransaction", AccountTransactionSchema);

module.exports = AccountTransaction;