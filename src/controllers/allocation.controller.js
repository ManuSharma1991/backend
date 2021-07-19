const Allocation = require("../db/models/allocation.model");
const { getNextSequenceValue } = require("../utilities/helper_functions");

const getAllocations = async (req, res) => {
    try {
        const allocations = Allocation.find({ budget: req.params.budget }).populate({ path: 'subCategory', populate: { path: 'category' } });
        res.send(allocations);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving allocations."
        });
    }
}

const createAllocation = async (req, res) => {
    try {
        const new_allocation = new Allocation(req.body);
        new_allocation._id = await getNextSequenceValue("allocation");
        const allocation = await new_allocation.save(new_allocation);
        const result = await allocation
            .populate({ path: 'subCategory', select: '_id name type userCreated category', populate: { path: 'category', select: '_id name type userCreated budgetAllocated spent budgetAvailable' } })
            .populate('budget', '_id').execPopulate();
        res.send(result);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving budget."
        });
    }
}

const getAllocationsByMonthAndBudget = async (req, res) => {
    try {
        const allocations = await Allocation.find({ $expr: { $eq: [{ $month: "$date" }, req.body.allocation.allocationMonth] }, budget: req.body.budget._id })
            .populate({ path: 'subCategory', populate: { path: 'category' } });
        res.send(allocations);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving allocations."
        });
    }
}

module.exports = { getAllocations, createAllocation, getAllocationsByMonthAndBudget }