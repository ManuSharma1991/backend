var mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    name: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    user: {
        type: Number,
        ref: 'User'
    },
    allocations: [{ type: Number, ref: 'Allocation' }],
    transactions: [{ type: Number, ref: 'Transaction' }],
}, { _id: false });

BudgetSchema.set('timestamps', true)

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;

