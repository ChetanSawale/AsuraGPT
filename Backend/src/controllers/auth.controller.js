const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

async function registerUser(req, res) {
    try {
        const { fullname, email, password } = req.body;

        if (!email || !password || !fullname || !fullname.firstname) {
            return res.status(400).json({ message: "Firstname, email, and password are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            email,
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname || ""
            },
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '7d' });

        res.cookie('token', token, cookieOptions);

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname
            }
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "Server error during registration" });
    }
}

async function loginuser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: "7d" });

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
            },
        });
    } catch (error) {
        console.error("Error in loginuser:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
}

async function logoutuser(req, res) {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
    registerUser,
    loginuser,
    logoutuser
};