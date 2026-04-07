const express = require('express');
const { applyLeave, getMyLeaves, getPendingLeaves, approveLeave, getLeaveStats } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/apply', protect, applyLeave);
router.get('/history', protect, getMyLeaves);
router.get('/pending', protect, authorize('Professor', 'HOD', 'Principal'), getPendingLeaves);
router.get('/stats', protect, authorize('HOD', 'Principal'), getLeaveStats);
router.put('/approve/:id', protect, authorize('Professor', 'HOD', 'Principal'), approveLeave);

module.exports = router;
