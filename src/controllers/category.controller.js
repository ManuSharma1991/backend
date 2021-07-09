const Category = require('../db/models/category.model');
const { getNextSequenceValue } = require('../utilities/helper_functions');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.params.user }).populate('subCategories', '_id name type userCreated budgetAllocated spent budgetAvailable');
        res.send(categories);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving categories."
        });
    }
}


const createCategory = async (req, res) => {
    try {
        const new_category = new Category(req.body);
        new_category._id = await getNextSequenceValue("category")

        const category = await new_category.save(new_category);
        res.send(category);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating category."
        });
    }
}

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('user', '_id userName').populate('subCategories', '_id name type userCreated budgetAllocated spent budgetAvailable');
        res.send(category);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving category."
        });
    }
}

module.exports = { getCategories, createCategory, getCategoryById }
