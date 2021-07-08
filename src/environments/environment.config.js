const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
    path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});
module.exports = {
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Budget" || "mongodb+srv://manusharma:Manu1991@budget.todio.mongodb.net/budget_dev?authSource=admin&replicaSet=atlas-bn9u8e-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000
};