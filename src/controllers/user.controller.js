const Account = require('../db/models/account.model');
const Budget = require('../db/models/budget.model');
const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const User = require('../db/models/user.model');


getUser = async (req, res, next) => {
    try {
        const user = await User.find();
        res.send(user);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving budget."
        });
    }
}


createUser = async (req, res, next) => {
    try {
        const user = await User.save(req.body);
        res.send(user);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving budget."
        });
    }
}

getUserById = async (req, res, next) => {
    try {
        const user = await User.findOne(req.body).select("-__v").select("-createdAt").select("-updatedAt");
        await populateUserData(user);
        res.send(user);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving budget."
        });
    }
}


populateUserData = async (user) => {
    const budgets = await Budget.find({ 'user': user._id }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, user: 0 });
    user.budget = budgets;

    const accounts = await Account.find({ 'user': user._id }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, user: 0 });
    user.account = accounts;


    const categories = await Category.find({ 'user': user._id }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, user: 0 });
    user.category = categories;

    const subCategories = await SubCategory.find({ 'user': user._id }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, user: 0 }).populate('category');
    user.subCategory = subCategories;
}

module.exports = { getUser, createUser, getUserById }
