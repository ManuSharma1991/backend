require("mongoose");
require('./src/db/mongoose.config');
const express = require('express');
const cors = require('cors')
const compression = require('compression');

const BudgetRouter = require('./src/routers/budget.router');

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
app.use(BudgetRouter);
app.listen(port, () => {
    console.log("Server is listening on port" + port);
});
