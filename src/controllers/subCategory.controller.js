const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const { getNextSequenceValue } = require('../utilities/helper_functions');

const createSubCategory = async (req, res) => {
    try {
        const new_sub_category = new SubCategory(req.body);
        new_sub_category._id = await getNextSequenceValue("subCategory")
        const subCategory = await new_sub_category.save(new_sub_category);
        const category = await Category.find({ _id: req.body.category });
        category.subCategories.push(subCategory._id);
        await category.save();
        res.send(subCategory);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating sub category."
        });
    }
}

module.exports = { createSubCategory }
