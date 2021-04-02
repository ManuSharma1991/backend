const Allocation = require("../db/models/allocation.model");
const Budget = require("../db/models/budget.model");
const Category = require("../db/models/category.model");
const SubCategory = require("../db/models/subCategory.model");
const User = require("../db/models/user.model");
const Promise = require('bluebird');
const mongoose = require('mongoose');
const { getNextSequenceValue } = require("../utilities/helper_functions");

const getAllocation = function getAllocation(req, res, next) {
    Allocation.find({}, '-__v -_id')
        .populate('budget', 'budgetName _id')
        .populate('user', 'userId userName -_id')
        .populate('category', ' categoryId categoryName -_id')
        .populate('subCategory', 'subCategoryId subCategoryName -_id')
        .then(allocation => {
            res.send(allocation);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

const createAllocation = function createAllocation(req, res, next) {
    let response = []
    Promise.each(req.body, async function (allocation) {
        const new_allocation = new Allocation(allocation);
        new_allocation._id = await getNextSequenceValue("allocation")
        new_allocation.remainingPerSubCategory = new_allocation.allocatedPerSubCategory - new_allocation.spentPerSubCategory
        await new_allocation.save(new_allocation)
            .then(async created_allocation => {
                const final_allocation_data = await created_allocation
                    .populate('budget', 'budgetId budgetName -_id')
                    .populate('user', 'userId userName -_id')
                    .populate('category', ' categoryId categoryName -_id')
                    .populate('subCategory', 'subCategoryId subCategoryName -_id').execPopulate()
                console.log(final_allocation_data)
                response[response.length + 1] = (final_allocation_data);
            })
    })
        .then(response => {
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });


}

const getAllocationByMonthAndBudget = function getAllocationByMonthAndBudget(req, res, next) {
    Budget.findOne(req.body.budget)
        .then(budget => {
            Allocation.find(
                {
                    allocationMonth: req.body.allocation.allocationMonth,
                    budget: mongoose.Types.ObjectId(budget._id)

                }
                , '-createdAt -updatedAt -__v -_id')
                .populate('budget', 'budgetId budgetName -_id')
                .populate('user', 'userId userName -_id')
                .populate('category', ' categoryId categoryName -_id')
                .populate('subCategory', 'subCategoryId subCategoryName -_id')
                .then(allocation => {
                    res.send(allocation);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving budget."
                    });
                });
        });
}

const getAllocationByMonthAsRaw = function getAllocationByMonthAsRaw(req, res, next) {
    Allocation.find(req.body, '-__v -_id')
        .populate('budget', 'budgetId budgetName -_id')
        .populate('user', 'userId userName -_id')
        .populate('category', ' categoryId categoryName -_id')
        .populate('subCategory', 'subCategoryId subCategoryName -_id')
        .then(allocation => {
            res.send(allocation);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

module.exports = { getAllocation, createAllocation, getAllocationByMonthAndBudget }