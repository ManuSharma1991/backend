const User = require("../db/models/user.model")
const mongoose = require('mongoose');
const { sequenceData } = require('../utilities/constant_data');

async function checkUser(user) {
    const user_data = await User.findById(user)
    if (user_data !== null) {
        return true
    } else {
        return false
    }
}

const CounterSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    sequenceValue: {
        type: Number
    },
}, { _id: false });

CounterSchema.set('timestamps', true)

const Counter = mongoose.model("Counter", CounterSchema);

// Counter.insertMany(sequenceData)

const getNextSequenceValue = async function getNextSequenceValue(sequenceOfName) {
    const sequenceDoc = await Counter.findByIdAndUpdate(sequenceOfName,
        {
            $inc: { sequenceValue: 1 },
        },
        {
            new: true
        });
    return sequenceDoc.sequenceValue;
}
module.exports = { checkUser, getNextSequenceValue }