const Leave = require('../models/Leave');

// @desc    Apply for leave
// @route   POST /api/leaves/apply
// @access  Private (Student, Professor, HOD)
const applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    const leave = await Leave.create({
      applicant: req.user._id,
      type,
      startDate,
      endDate,
      reason,
      approverId: req.user.approver // Automatically assign based on user mapping
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's leave history
// @route   GET /api/leaves/history
// @access  Private
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ applicant: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending leaves to approve (for Professor, HOD, Principal)
// @route   GET /api/leaves/pending
// @access  Private
const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ 
      approverId: req.user._id, 
      status: 'Pending' 
    })
      .populate({
        path: 'applicant',
        select: 'name role department'
      })
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject leave
// @route   PUT /api/leaves/approve/:id
// @access  Private
const approveLeave = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const { role, department, _id: userId } = req.user;
    const leaveId = req.params.id;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const leave = await Leave.findById(leaveId).populate('applicant', 'name role department');
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Strict check: current user must be the assigned approver
    if (leave.approverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not the designated approver for this leave request' });
    }

    // Assign approver
    leave.status = status;
    leave.approverId = userId;
    leave.remarks = remarks || leave.remarks;

    const updatedLeave = await leave.save();
    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getPendingLeaves,
  approveLeave
};
