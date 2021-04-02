const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const User = require('../db/models/user.model');
const { getNextSequenceValue } = require('../utilities/helper_functions');

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


const createSubCategory = async function createSubCategory(req, res, next) {
    const new_sub_category = new SubCategory(req.body);
    new_sub_category._id = await getNextSequenceValue("subCategory")

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
    SubCategory.findById(req.body._id)
        .populate('category')
        .populate('user')
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
