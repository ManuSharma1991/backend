var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AllocationSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    allocationMonth: {
        type: Number,
    },
    allocatedPerSubCategory: {
        type: Number,
        required: true
    },
    spentPerSubCategory: {
        type: Number,
        required: true
    },
    remainingPerSubCategory: Number,
    budget: {
        type: Number, ref: 'Budget'
    },
    category: {
        type: Number, ref: 'Category'
    },
    subCategory: {
        type: Number, ref: 'SubCategory'
    },
    user: {
        type: Number, ref: 'User'
    }
}, { _id: false });

AllocationSchema.set('timestamps', true)

// AllocationSchema.plugin(AutoIncrement, {
//     inc_field: 'allocationId',
//     start_seq: 1000001,
//     inc_amount: 1
// })

const Allocation = mongoose.model("Allocation", AllocationSchema);

module.exports = Allocation;

