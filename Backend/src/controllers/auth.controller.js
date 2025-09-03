const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function registerUser(req, res) {
    const {  fullname: {firstname , lastname}, email, password } = req.body;

    const existingUser = await userModel.findOne({email});
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        email,
        fullname: {
            firstname,
            lastname
        },
        password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname
        }

    });
}

async function loginuser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // ✅ Cookie with proper options
  res.cookie("token", token, {
    httpOnly: true,    // not accessible from JS
    secure: false,     // set true in production (HTTPS only)
    sameSite: "lax",   // prevent CSRF, but allow same-site
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
    },
  });
}


module.exports = {
    registerUser,
    loginuser
};