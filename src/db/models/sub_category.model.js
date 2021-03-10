var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const SubCategorySchema = new mongoose.Schema({
    sub_category_id: {
        type: Number,
    },
    sub_category_name: {
        type: String,
        required: true
    },
    sub_user_created: {
        type: Boolean,
        default: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    allocation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Allocation' }],
    transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transaction' }],
});

SubCategorySchema.set('timestamps', true);

SubCategorySchema.plugin(AutoIncrement, {
    inc_field: 'sub_category_id',
    start_seq: 10001,
    inc_amount: 1
})


const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategory;

