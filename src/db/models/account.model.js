var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AccountSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    accountName: {
        type: String,
        required: true
    },
    accountType: {
        type: String
    },
    accountTotal: {
        type: Number,
    },
    accountBalance: {
        type: Number,
        default: 0
    },
    accountSpent: {
        type: Number,
        default: 0
    },
    user: {
        type: Number, ref: 'User'
    },
    account_transaction: [{
        type: Number, ref: 'Transaction'
    }]
}, { _id: false });

AccountSchema.set('timestamps', true)

// AccountSchema.plugin(AutoIncrement, {
//     inc_field: 'accountId',
//     start_seq: 101,
//     inc_amount: 1
// })

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;

