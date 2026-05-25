const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { askChat } = require('../controllers/chatController');

router.post('/', auth, askChat);

module.exports = router;
