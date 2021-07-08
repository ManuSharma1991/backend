var mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    userName: {
        type: String,
        required: true
    },
    userMobileNo: {
        type: Number,
        required: true,
        unique: true
    },
    budgets: [{ type: Number, ref: 'Budget' }],
    accounts: [{ type: Number, ref: 'Account' }],
    categories: [{ type: Number, ref: 'Category' }]
}, { _id: false });


UserSchema.set('timestamps', true)

const User = mongoose.model("User", UserSchema);
module.exports = User;