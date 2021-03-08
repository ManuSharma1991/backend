var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AccountSchema = new mongoose.Schema({
    account_id: {
        type: Number,
        index: true
    },
    account_name: {
        type: String,
        required: true
    },
    account_type: {
        type: String
    },
    account_initial_balance: {
        type: Number,
    },
    account_current_balance: {
        type: Number,
        default: 0
    },
    account_spent_amount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

AccountSchema.set('timestamps', true)

AccountSchema.plugin(AutoIncrement, {
    inc_field: 'account_id',
    start_seq: 101,
    inc_amount: 1
})

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;

