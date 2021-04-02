const express = require("express");
const categoryController = require("../controllers/category.controller");

const CategoryRouter = express.Router();

CategoryRouter.get('/getCategory', categoryController.getCategory);
CategoryRouter.post('/getCategoryById', categoryController.getCategoryById);
CategoryRouter.post('/createCategory', categoryController.createCategory);
module.exports = CategoryRouter;
