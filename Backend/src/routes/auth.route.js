const express = require('express');
const {registerUser, loginuser} = require('../controllers/auth.controller');


const router = express.Router();

router.post('/register',registerUser)
router.post('/login', loginuser);


module.exports = router;