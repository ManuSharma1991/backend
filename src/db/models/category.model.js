var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CategorySchema = new mongoose.Schema({
    category_id: {
        type: Number,
    },
    category_name: {
        type: String,
        required: true
    },
    user_created: {
        type: Boolean,
        default: true
    },
    sub_category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
    allocation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Allocation' }],
    transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transaction' }],
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});


CategorySchema.set('timestamps', true)

CategorySchema.plugin(AutoIncrement, {
    inc_field: 'category_id',
    start_seq: 1001,
    inc_amount: 1
})

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;

