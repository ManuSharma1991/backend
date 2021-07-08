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
    subCategories: [{
        type: Number,
        ref: 'SubCategory'
    }]
}, { _id: false });


CategorySchema.set('timestamps', true)

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;

