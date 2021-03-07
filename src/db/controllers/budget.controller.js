const Budget = require('../models/budget.model');

const getBudget = function getBudget(req, res, next) {
    Budget.find()
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
    const new_budget = new Budget(req.body);
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

module.exports = { getBudget, createBudget }
