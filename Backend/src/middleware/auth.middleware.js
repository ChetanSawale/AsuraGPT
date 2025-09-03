const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authuser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Token Unauthorized" });
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await userModel.findById(decoded.id);

        req.user = user;
    }
    catch (error) {
        return res.status(401).json({ message: "Error Unauthorized" });
    }


    next();
}

module.exports = authuser;