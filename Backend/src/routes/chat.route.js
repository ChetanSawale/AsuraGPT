const express  = require('express');
const authuser = require('../middleware/auth.middleware');
const {createChat ,getchats} = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', authuser , createChat);
router.get('/',authuser, getchats)

module.exports = router;