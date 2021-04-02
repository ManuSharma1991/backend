const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const User = require('../db/models/user.model');
const { getNextSequenceValue } = require('../utilities/helper_functions');

const getCategory = function getCategory(req, res, next) {
    Category.find()
        .populate('user')
        .populate('subCategory')
        .then(category => {
            res.send(category);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}


const createCategory = async function createCategory(req, res, next) {
    const new_category = new Category(req.body);
    new_category._id = await getNextSequenceValue("category")

    new_category.save(new_category)
        .then(category => {
            res.send(category);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

const getCategoryById = function getCategoryById(req, res, next) {
    Category.findById(req.params.id)
        .populate('user', '_id userName')
        .then(async function (category) {
            await SubCategory.find({ 'category': category._id })
                .then(async function (subCategory) {
                    subCategory.forEach(s_category => {
                        category.subCategory.push(s_category);
                    })
                })
            res.send(category);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

module.exports = { getCategory, createCategory, getCategoryById }
