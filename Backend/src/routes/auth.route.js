const express = require('express');
const { registerUser, loginuser, logoutuser } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginuser);
router.post('/logout', logoutuser);

module.exports = router;