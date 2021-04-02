const Account = require('../db/models/account.model');
const Allocation = require('../db/models/allocation.model');
const Budget = require('../db/models/budget.model');
const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/subCategory.model');
const Transaction = require('../db/models/transaction.model');
const User = require('../db/models/user.model');
const Promise = require('bluebird');
const { getNextSequenceValue } = require('../utilities/helper_functions');


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
        const newUser = new User(req.body);
        newUser._id = await getNextSequenceValue("user")
        const user = await newUser.save();
        startingData.forEach(async element => {

            const new_category = new Category(element.category)
            new_category._id = await getNextSequenceValue("category")

            const user_found = await User.findOne({ '_id': user._id })
            new_category.user = user_found._id;

            const category = await new_category.save();

            element.subCategory.forEach(async sub_category => {

                const new_sub_category = new SubCategory(sub_category.subCategory)
                new_sub_category._id = await getNextSequenceValue("subCategory")

                const category_found = await Category.findOne({ '_id': new_category._id })
                new_sub_category.category = category_found._id;

                new_sub_category.user = user_found._id;

                const subCategory = await new_sub_category.save()
            });
        });
        res.send(user);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving budget."
        });
    }
}

getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(Number(req.body._id)).select("-__v -createdAt -updatedAt");
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

    const subCategories = await SubCategory.find({ 'user': user._id }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, user: 0 }).populate('category', ' _id categoryName ')
    user.subCategory = subCategories;

    const allocations = await Allocation.find({ 'user': user._id }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, user: 0 })
        .populate('budget', 'budgetId budgetName -_id')
        .populate('user', 'userId userName -_id')
        .populate('category', ' categoryId categoryName -_id')
        .populate('subCategory', 'subCategoryId subCategoryName -_id')

    user.allocation = allocations;

    const transactions = await Transaction.find({ 'user': user._id }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, user: 0 })
        .populate('budget', 'budgetId budgetName -_id')
        .populate('user', 'userId userName -_id')
        .populate('category', ' categoryId categoryName -_id')
        .populate('subCategory', 'subCategoryId subCategoryName -_id')
        .populate('toAccount', 'accountName accountId  -_id')
        .populate('fromAccount', 'accountName accountId  -_id')
    user.transaction = transactions;
}

async function getBudgetId(allocation) {
    await Budget.findById(allocation.budget)
        .then(budget => {
            console.log(budget);
            allocation.budget = budget.budgetId;
        })
    console.log('2')
    return allocation
}

module.exports = { getUser, createUser, getUserById }
