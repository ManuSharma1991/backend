const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const User = require('../db/models/user.model');

const getSubCategory = function getSubCategory(req, res, next) {
    SubCategory.find()
        .populate('user')
        .populate('category')
        .then(subCategory => {
            res.send(subCategory);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}


const createSubCategory = function createSubCategory(req, res, next) {
    const new_sub_category = new SubCategory(req.body.subCategory);

    Category.findOne(req.body.category)
        .then(category => {
            new_sub_category.category = category._id;
        });

    User.findOne(req.body.user)
        .then(user => {
            new_sub_category.user = user._id;
        });

    new_sub_category.save(new_sub_category)
        .then(subCategory => {
            res.send(subCategory);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}


const getSubCategoryById = function getSubCategoryById(req, res, next) {
    SubCategory.findOne(req.body)
        .populate('category')
        .then(subCategory =>
            res.send(subCategory)
        )
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

module.exports = { getSubCategory, createSubCategory, getSubCategoryById }
