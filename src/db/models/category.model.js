var mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    userCreated: {
        type: Boolean,
        default: true
    },
    budgetAllocated: {
        type: Number,
        default: 0
    },
    spent: {
        type: Number,
        default: 0
    },
    budgetAvailable: {
        type: Number,
        default: 0
    },
    subCategories: [{
        type: Number,
        ref: 'SubCategory'
    }]
}, { _id: false });


CategorySchema.set('timestamps', true)

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;

