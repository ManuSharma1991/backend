require("mongoose");
require('./src/db/mongoose.config');
const express = require('express');
const cors = require('cors')
const compression = require('compression');

const BudgetRouter = require('./src/routers/budget.router');
const AccountRouter = require("./src/routers/account.router");
const CategoryRouter = require("./src/routers/category.router");
const SubCategoryRouter = require("./src/routers/sub_category.router");
const UserRouter = require("./src/routers/user.router");

const port = process.env.PORT || 3000
const app = express();

app.use(cors());
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(compression())
var distDir = __dirname + "/dist/budget/";
app.use(express.static(distDir));
app.use(UserRouter)
app.use(BudgetRouter);
app.use(AccountRouter);
app.use(CategoryRouter);
app.use(SubCategoryRouter)
app.listen(port, () => {
    console.log("Server is listening on port" + port);
});
