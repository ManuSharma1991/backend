const express = require("express");
const subCategoryController = require("../controllers/sub_category.controller");

const SubCategoryRouter = express.Router();

SubCategoryRouter.get('/getSubCategory', subCategoryController.getSubCategory);
SubCategoryRouter.post('/getSubCategoryById', subCategoryController.getSubCategoryById);
SubCategoryRouter.post('/createSubCategory', subCategoryController.createSubCategory);
module.exports = SubCategoryRouter;
