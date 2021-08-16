const Allocation = require('../db/models/allocation.model');
const Category = require('../db/models/category.model');
const Transaction = require('../db/models/transaction.model');
const SubCategory = require('../db/models/subCategory.model');
const User = require('../db/models/user.model');
const { startingData } = require('../utilities/constant_data');
const { getNextSequenceValue } = require('../utilities/helper_functions');


const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        res.send(user);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
}


const createUser = async (req, res) => {
    try {
        const userId = await getNextSequenceValue("user");
        const userCategories = [];

        for (const element of startingData) {
            const new_category = new Category(element.category)
            new_category._id = await getNextSequenceValue("category")
            new_category.user = userId;
            new_category.subCategories = [];

            const sub_categories = [];
            const sub_category_ids = [];
            for (const sub_category of element.subCategory) {
                sub_category._id = await getNextSequenceValue("subCategory")
                sub_category.category = new_category._id;
                sub_categories.push(sub_category);
                sub_category_ids.push(sub_category._id);
            }
            new_category.subCategories = sub_category_ids;
            await new_category.save();
            await SubCategory.insertMany(sub_categories);
            userCategories.push(new_category._id);
        }

        const newUser = new User(req.body);
        newUser._id = userId;
        newUser.categories = userCategories;
        const user = await newUser.save();
        res.send(user);
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.status(500).send({
                message: "User with mobile number " + err.keyValue.userMobileNo + " already exists."
            });
        } else {
            res.status(500).send({
                message: err.message || "Some error occurred while creating user."
            });
        }
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(Number(req.params.id)).select("-__v -createdAt -updatedAt")
            .populate({ path: 'categories', match: { deleted: false }, select: '_id name type userCreated subCategories budgetAllocated spent budgetAvailable', populate: { path: 'subCategories', match: { deleted: false }, select: '_id name type userCreated category budgetAllocated spent budgetAvailable' } })
            .populate({ path: 'budgets', select: '_id name currency transactions allocations' })
            .populate('accounts', '_id name type total balance spent transactions');
        if (user === null) {
            res.status(404).send({
                message: "User not found"
            });
        } else {
            for (const budget of user.budgets) {
                const allocations = await Allocation.find({ budget: budget._id })
                    .populate({ path: 'subCategory', select: '_id name type userCreated category', populate: { path: 'category', select: '_id name type userCreated budgetAllocated spent budgetAvailable' } })
                    .populate('budget', '_id');
                const transactions = await Transaction.find({ budget: budget._id })
                    .populate({ path: 'subCategory', select: '_id name type userCreated category', populate: { path: 'category', select: '_id name type userCreated budgetAllocated spent budgetAvailable' } })
                    .populate('fromAccount', '_id name')
                    .populate('toAccount', '_id name')
                    .populate('budget', '_id');
                budget.allocations = allocations;
                budget.transactions = transactions;
            }
            for (const account of user.accounts) {
                const transactions = await Transaction.find({ $or: [{ toAccount: account._id }, { fromAccount: account._id }] })
                    .populate({ path: 'subCategory', select: '_id name type userCreated category', populate: { path: 'category', select: '_id name type userCreated budgetAllocated spent budgetAvailable' } })
                    .populate('fromAccount', '_id name')
                    .populate('toAccount', '_id name');
                account.transactions = transactions;
            }
            res.send(user);
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving budget."
        });
    }
}

const changeMode = async (req, res) => {
    try {
        const userId = req.body.userId;
        const mode = req.body.mode;
        await User.findByIdAndUpdate(userId, { darkMode: mode });
        res.send({ mode: mode });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving budget."
        });
    }
}

module.exports = { getUsers, createUser, getUserById, changeMode }
