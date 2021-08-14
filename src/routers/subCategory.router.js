const express = require("express");
const subCategoryController = require("../controllers/subCategory.controller");

const SubCategoryRouter = express.Router();

SubCategoryRouter.post('/createSubCategory', subCategoryController.createSubCategory);
SubCategoryRouter.delete('/deleteSubCategory/:id', subCategoryController.deleteSubCategory);

module.exports = SubCategoryRouter;
