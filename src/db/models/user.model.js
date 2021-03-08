var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    user_id: {
        type: Number,
    },
    user_name: {
        type: String,
        required: true
    },
    user_mobile_no: {
        type: Number,
        required: true
    },
    budget: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }],
    account: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    sub_category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
});


UserSchema.set('timestamps', true)

UserSchema.plugin(AutoIncrement, {
    inc_field: 'user_id',
    start_seq: 90000001,
    inc_amount: 1
})

const User = mongoose.model("User", UserSchema);
module.exports = User;