var mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        default: 0,
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        required: true
    },
    spent: {
        type: Number,
        default: 0,
        required: true
    },
    user: {
        type: Number,
        ref: 'User'
    },
    transactions: [{
        type: Number,
        ref: 'Transaction'
    }]
}, { _id: false });

AccountSchema.set('timestamps', true)

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;

