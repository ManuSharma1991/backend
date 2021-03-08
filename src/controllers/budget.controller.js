const Budget = require('../db/models/budget.model');
const User = require('../db/models/user.model');

const getBudget = function getBudget(req, res, next) {
    Budget.find()
        .populate('user')
        .then(budget => {
            res.send(budget);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}


const createBudget = function createBudget(req, res, next) {
    const new_budget = new Budget(req.body.budget);

    User.findOne(req.body.user)
        .then(user => {
            new_budget.user = user._id;
        });

    new_budget.save(new_budget)
        .then(budget => {
            res.send(budget);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

const getBudgetById = function getBudgetById(req, res, next) {
    Budget.findOne(req.body)
        .populate('user')
        .then(budget => {
            res.send(budget);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving budget."
            });
        });
}

module.exports = { getBudget, createBudget, getBudgetById }
