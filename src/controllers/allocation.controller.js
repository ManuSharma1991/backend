const Allocation = require("../db/models/allocation.model");
const Budget = require("../db/models/budget.model");
const Category = require("../db/models/category.model");
const SubCategory = require("../db/models/sub_category.model");
const User = require("../db/models/user.model");
const Promise = require('bluebird');

const getAllocation = function getAllocation(req, res, next) {
    Allocation.find({}, '-__v -_id')
        .populate('budget', 'budget_id budget_name -_id')
        .populate('user', 'user_id user_name -_id')
        .populate('category', ' category_id category_name -_id')
        .populate('sub_category', 'sub_category_id sub_category_name -_id')
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

        SubCategory.findOne(allocation.sub_category)
            .then(sub_category => {
                new_allocation.sub_category = sub_category._id;
            });


        new_allocation.remaining_per_sub_category = new_allocation.allocated_per_sub_category - new_allocation.spent_per_sub_category
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

const getAllocationByMonth = function getAllocationByMonth(req, res, next) {
    Allocation.find(req.body, '-__v -_id')
        .populate('budget', 'budget_id budget_name -_id')
        .populate('user', 'user_id user_name -_id')
        .populate('category', ' category_id category_name -_id')
        .populate('sub_category', 'sub_category_id sub_category_name -_id')
        .then(allocation => {
            console.log(allocation[0].category.category_name)
            res.send(allocation);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

const getAllocationByMonthAsRaw = function getAllocationByMonthAsRaw(req, res, next) {
    Allocation.find(req.body, '-__v -_id')
        .populate('budget', 'budget_id budget_name -_id')
        .populate('user', 'user_id user_name -_id')
        .populate('category', ' category_id category_name -_id')
        .populate('sub_category', 'sub_category_id sub_category_name -_id')
        .then(allocation => {
            res.send(allocation);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

module.exports = { getAllocation, createAllocation, getAllocationByMonthAsRaw }