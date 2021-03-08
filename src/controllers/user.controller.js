const Account = require('../db/models/account.model');
const Budget = require('../db/models/budget.model');
const Category = require('../db/models/category.model');
const SubCategory = require('../db/models/sub_category.model');
const User = require('../db/models/user.model');


const getUser = function getUSer(req, res, next) {
    User.find()
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}


const createUser = function createUser(req, res, next) {
    const new_user = new User(req.body);

    new_user.save(new_user)
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

const getUserById = function getUserById(req, res, next) {
    User.findOne(req.body)
        .then(async function (user) {
            await populateUserData(user)
            res.send(user)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}


async function populateUserData(user) {
    await Budget.find({ 'user': user._id })
        .then(async function (budget_data) {
            await budget_data.forEach(budget => {
                user.budget.push(budget);
            })
        })
    await Account.find({ 'user': user._id })
        .then(async function (account_data) {
            await account_data.forEach(account => {
                user.account.push(account);
            })
        })
    await Category.find({ 'user': user._id })
        .then(async function (category_data) {
            await category_data.forEach(category => {
                user.category.push(category);
            })
        })
    await SubCategory.find({ 'user': user._id })
        .populate('category')
        .then(async function (sub_category) {
            await sub_category.forEach(s_category => {
                user.sub_category.push(s_category);
            })
        })
}

module.exports = { getUser, createUser, getUserById }
