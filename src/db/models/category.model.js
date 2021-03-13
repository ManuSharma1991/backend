var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CategorySchema = new mongoose.Schema({
    categoryId: {
        type: Number,
    },
    categoryName: {
        type: String,
        required: true
    },
    userCreated: {
        type: Boolean,
        default: true
    },
    subCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
    allocation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Allocation' }],
    transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});


CategorySchema.set('timestamps', true)

CategorySchema.plugin(AutoIncrement, {
    inc_field: 'categoryId',
    start_seq: 1001,
    inc_amount: 1
})

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;

