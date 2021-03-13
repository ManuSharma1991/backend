const Allocation = require("../db/models/allocation.model");
const Budget = require("../db/models/budget.model");
const Category = require("../db/models/category.model");
const SubCategory = require("../db/models/subCategory.model");
const User = require("../db/models/user.model");
const Promise = require('bluebird');
const mongoose = require('mongoose');

const getAllocation = function getAllocation(req, res, next) {
    Allocation.find({}, '-__v -_id')
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

const createAllocation = function createAllocation(req, res, next) {
    let response = []
    Promise.each(req.body, async function (allocation) {
        const new_allocation = new Allocation(allocation.allocation);
        User.findOne(allocation.user)
            .then(user => {
                new_allocation.user = user._id;
            });

        Budget.findOne(allocation.budget)
            .then(budget => {
                new_allocation.budget = budget._id
            });

        Category.findOne(allocation.category)
            .then(category => {
                new_allocation.category = category._id;
            });

        SubCategory.findOne(allocation.subCategory)
            .then(subCategory => {
                new_allocation.subCategory = subCategory._id;
            });


        new_allocation.remainingPerSubCategory = new_allocation.allocatedPerSubCategory - new_allocation.spentPerSubCategory
        await new_allocation.save(new_allocation)
            .then(allocation => {
                response.push(allocation);
            })
    })
        .then(response => {
            res.send(response)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });


}

const getAllocationByMonthAndBudget = function getAllocationByMonthAndBudget(req, res, next) {
    console.log(req.body.allocation)
    Budget.findOne(req.body.budget)
        .then(budget => {
            console.log(budget);
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