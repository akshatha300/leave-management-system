const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getUsers, createUser, updateUser, deleteUser, getAvailableApprovers } = require('../controllers/userController');

const router = express.Router();

// All user routes are protected and restricted to Principal
router.use(protect);
router.use(authorize('Principal'));

router.get('/available-approvers', getAvailableApprovers);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
