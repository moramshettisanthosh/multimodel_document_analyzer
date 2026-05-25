const express = require('express');
const router = express.Router();
const { register, login, me, googleLogin } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', auth, me);

module.exports = router;
