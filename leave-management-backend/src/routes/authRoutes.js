const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const { getAvailableApprovers } = require('../controllers/userController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/available-approvers', getAvailableApprovers);

module.exports = router;
