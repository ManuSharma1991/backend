const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const User = require('../db/models/user.model');

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


const createCategory = function createCategory(req, res, next) {
    const new_category = new Category(req.body.category);

    User.findOne(req.body.user)
        .then(user => {
            new_category.user = user._id;
        });

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

const createCategoryWithSubCategories = function createCategoryWithSubCategories(req, res, next) {
    const new_category = new Category(req.body.category);
    const new_subcategory = new SubCategory(req.body.subCategory)

    User.findOne(req.body.user)
        .then(user => {
            new_category.user = user._id;
        });

    new_category.save(new_category)
        .then(category => {
            new_subcategory.category = category._id
            new_subcategory.save(new_subcategory)
            res.send(category);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

const getCategoryById = function getCategoryById(req, res, next) {
    Category.findOne(req.body)
        .populate('user')
        .then(async function (category) {
            await SubCategory.find({ 'category': category._id })
                .then(async function (subCategory) {
                    await subCategory.forEach(s_category => {
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

module.exports = { getCategory, createCategory, getCategoryById, createCategoryWithSubCategories }
