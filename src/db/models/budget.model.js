var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const BudgetSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    budgetName: {
        type: String,
        required: true
    },
    budgetCurrency: {
        type: String,
        required: true
    },
    userId: {
        type: Number
    },
    user: {
        type: Number, ref: 'User'
    },
    allocation: [{ type: Number, ref: 'Allocation' }],
    transaction: [{ type: Number, ref: 'Transaction' }],
}, { _id: false });

BudgetSchema.set('timestamps', true)

// BudgetSchema.plugin(AutoIncrement, {
//     inc_field: 'budgetId',
//     start_seq: 1,
//     inc_amount: 1
// })

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;

