var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AllocationSchema = new mongoose.Schema({
    allocation_id: {
        type: Number,
        index: true
    },
    allocation_month: {
        type: Number,
        index: true,
    },
    allocated_per_sub_category: {
        type: Number,
        required: true
    },
    spent_per_sub_category: {
        type: Number,
        required: true
    },
    remaining_per_sub_category: Number,
    budget: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Budget'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    sub_category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

AllocationSchema.set('timestamps', true)

AllocationSchema.plugin(AutoIncrement, {
    inc_field: 'allocation_id',
    start_seq: 1000001,
    inc_amount: 1
})

const Allocation = mongoose.model("Allocation", AllocationSchema);

module.exports = Allocation;

