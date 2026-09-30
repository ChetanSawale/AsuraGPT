const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

async function registerUser(req, res) {
    try {
        const { fullname, firstname, lastname, email, password } = req.body;

        let finalFirstname = firstname;
        let finalLastname = lastname || "";

        if (fullname && typeof fullname === 'object') {
            finalFirstname = fullname.firstname || finalFirstname;
            finalLastname = fullname.lastname || finalLastname;
        } else if (fullname && typeof fullname === 'string') {
            const parts = fullname.trim().split(' ');
            finalFirstname = parts[0];
            finalLastname = parts.slice(1).join(' ') || "";
        }

        if (!email || !password || !finalFirstname) {
            return res.status(400).json({ message: "First name, email, and password are required" });
        }

        const existingUser = await userModel.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            email: email.toLowerCase().trim(),
            fullname: {
                firstname: finalFirstname,
                lastname: finalLastname
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
        console.error("❌ Error in registerUser:", error);
        return res.status(500).json({ message: error.message || "Server error during registration" });
    }
}

async function loginuser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email: email.toLowerCase().trim() });
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
        console.error("❌ Error in loginuser:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
}

async function logoutuser(req, res) {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
    registerUser,
    loginuser,
    logoutuser
};