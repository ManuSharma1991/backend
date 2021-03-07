const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
    path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});
module.exports = {
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Budget",
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000
};