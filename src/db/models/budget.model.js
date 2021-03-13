var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const BudgetSchema = new mongoose.Schema({
    budgetId: {
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
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    allocation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Allocation' }],
    transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
});

BudgetSchema.set('timestamps', true)

BudgetSchema.plugin(AutoIncrement, {
    inc_field: 'budgetId',
    start_seq: 1,
    inc_amount: 1
})

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;

