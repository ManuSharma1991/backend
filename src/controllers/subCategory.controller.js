const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const { getNextSequenceValue } = require('../utilities/helper_functions');

const createSubCategory = async (req, res) => {
    try {
        const new_sub_category = new SubCategory(req.body);
        new_sub_category._id = await getNextSequenceValue("subCategory");
        const category = await Category.findById(req.body.category);
        category.subCategories.push(new_sub_category._id);
        const subCategory = await new_sub_category.save(new_sub_category);
        await category.save();
        const subCategory_data = await subCategory.populate('category', '_id').execPopulate();
        res.send(subCategory_data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating sub category."
        });
    }
}

const deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, { deleted: true });
        res.send({ categoryId: subCategory.category, subCategoryId: subCategory._id });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving category."
        });
    }
}

module.exports = { createSubCategory, deleteSubCategory }
