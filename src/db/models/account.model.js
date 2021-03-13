var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AccountSchema = new mongoose.Schema({
    accountId: {
        type: Number,
        index: true
    },
    accountName: {
        type: String,
        required: true
    },
    accountType: {
        type: String
    },
    accountInitialBalance: {
        type: Number,
    },
    accountCurrentBalance: {
        type: Number,
        default: 0
    },
    accountSpentAmount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    account_transaction: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'
    }]
});

AccountSchema.set('timestamps', true)

AccountSchema.plugin(AutoIncrement, {
    inc_field: 'accountId',
    start_seq: 101,
    inc_amount: 1
})

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;

