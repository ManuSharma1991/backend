var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AllocationSchema = new mongoose.Schema({
    allocationId: {
        type: Number,
        index: true
    },
    allocationMonth: {
        type: Number,
        index: true,
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
        type: mongoose.Schema.Types.ObjectId, ref: 'Budget'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

AllocationSchema.set('timestamps', true)

AllocationSchema.plugin(AutoIncrement, {
    inc_field: 'allocationId',
    start_seq: 1000001,
    inc_amount: 1
})

const Allocation = mongoose.model("Allocation", AllocationSchema);

module.exports = Allocation;

