const express = require("express");
const categoryController = require("../controllers/category.controller");

const CategoryRouter = express.Router();

CategoryRouter.get('/getCategories/:user', categoryController.getCategories);
CategoryRouter.get('/getCategory/:id', categoryController.getCategoryById);
CategoryRouter.post('/createCategory', categoryController.createCategory);
CategoryRouter.delete('/deleteCategory/:id', categoryController.deleteCategory);
module.exports = CategoryRouter;
