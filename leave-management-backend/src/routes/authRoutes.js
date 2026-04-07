const express = require('express');
const { loginUser, registerUser, getProfile } = require('../controllers/authController');
const { getAvailableApprovers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/available-approvers', getAvailableApprovers);
router.get('/me', protect, getProfile);

module.exports = router;
