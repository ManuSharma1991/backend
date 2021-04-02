var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const SubCategorySchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    subCategoryName: {
        type: String,
        required: true
    },
    userCreated: {
        type: Boolean,
        default: true
    },
    category: {
        type: Number, ref: 'Category'
    },
    user: {
        type: Number, ref: 'User'
    },
    allocation: [{ type: Number, ref: 'Allocation' }],
    transaction: [{ type: Number, ref: 'Transaction' }],
}, { _id: false });

SubCategorySchema.set('timestamps', true);

// SubCategorySchema.plugin(AutoIncrement, {
//     inc_field: 'subCategoryId',
//     start_seq: 10001,
//     inc_amount: 1
// })


const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategory;

