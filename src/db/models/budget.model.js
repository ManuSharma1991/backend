var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const BudgetSchema = new mongoose.Schema({
    budget_id: {
        type: Number,
    },
    budget_name: {
        type: String,
        required: true
    },
    budget_currency: {
        type: String,
        required: true
    },
    user_id: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    allocation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Allocation' }],
    transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transaction' }],
});

BudgetSchema.set('timestamps', true)

BudgetSchema.plugin(AutoIncrement, {
    inc_field: 'budget_id',
    start_seq: 1,
    inc_amount: 1
})

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;

