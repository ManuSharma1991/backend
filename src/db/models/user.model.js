var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
        required: true
    },
    budget: [{ type: Number, ref: 'Budget' }],
    account: [{ type: Number, ref: 'Account' }],
    category: [{ type: Number, ref: 'Category' }],
    subCategory: [{ type: Number, ref: 'SubCategory' }],
    allocation: [{ type: Number, ref: 'Allocation' }],
    transaction: [{ type: Number, ref: 'Transaction' }],
}, { _id: false });


UserSchema.set('timestamps', true)

// UserSchema.plugin(AutoIncrement, {
//     inc_field: 'userId',
//     start_seq: 90000001,
//     inc_amount: 1
// })

const User = mongoose.model("User", UserSchema);
module.exports = User;