var mongoose = require("mongoose");

const AllocationSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    budget: {
        type: Number, ref: 'Budget'
    },
    subCategory: {
        type: Number, ref: 'SubCategory'
    }
}, { _id: false });

AllocationSchema.set('timestamps', true)

const Allocation = mongoose.model("Allocation", AllocationSchema);

module.exports = Allocation;

