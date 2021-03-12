const User = require("../db/models/user.model")
const strings = require("../utilities/constant_data")

async function checkUser(user) {
    const user_data = await User.find(user)
    if (user_data.length > 0) {
        return true
    } else {
        return false
    }
}
module.exports = { checkUser }