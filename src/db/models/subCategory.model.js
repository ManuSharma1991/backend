var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const SubCategorySchema = new mongoose.Schema({
    subCategoryId: {
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
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    allocation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Allocation' }],
    transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
});

SubCategorySchema.set('timestamps', true);

SubCategorySchema.plugin(AutoIncrement, {
    inc_field: 'subCategoryId',
    start_seq: 10001,
    inc_amount: 1
})


const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategory;

