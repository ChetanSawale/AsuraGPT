const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authuser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token provided, unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found, unauthorized" });
        }

        req.user = user;
        next(); // ✅ only called if everything passes
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = authuser;
