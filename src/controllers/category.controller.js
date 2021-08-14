const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const User = require('../db/models/user.model');
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

        const user = await User.findById(req.body.user);
        user.categories.push(new_category._id);

        const category = await new_category.save(new_category);
        await user.save();
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

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { deleted: true });
        for (const subCategoryId of category.subCategories) {
            await SubCategory.findByIdAndUpdate(subCategoryId, { deleted: true });
        }
        res.send({ _id: category._id });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving category."
        });
    }
}

module.exports = { getCategories, createCategory, getCategoryById, deleteCategory }
