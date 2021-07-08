var mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
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
    category: {
        type: Number,
        ref: 'Category'
    }
}, { _id: false });

SubCategorySchema.set('timestamps', true);


const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategory;

