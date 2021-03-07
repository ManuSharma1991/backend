var mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    budget_id: {
        type: Number,
    },
    budget_name: {
        type: String,
    },
    budget_currency: {
        type: String,
    }
});

const Budget = mongoose.model("budget", BudgetSchema);

module.exports = Budget;

