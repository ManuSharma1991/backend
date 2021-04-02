var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CategorySchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    categoryName: {
        type: String,
        required: true
    },
    categoryType: {
        type: String,
        required: true
    },
    userCreated: {
        type: Boolean,
        default: true
    },
    subCategory: [{ type: Number, ref: 'SubCategory' }],
    allocation: [{ type: Number, ref: 'Allocation' }],
    transaction: [{ type: Number, ref: 'Transaction' }],
    user: {
        type: Number, ref: 'User'
    }
}, { _id: false });


CategorySchema.set('timestamps', true)

// CategorySchema.plugin(AutoIncrement, {
//     inc_field: 'categoryId',
//     start_seq: 1001,
//     inc_amount: 1
// })

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;

