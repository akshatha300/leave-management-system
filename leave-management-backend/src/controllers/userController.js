const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin(Principal)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate('approver', 'name email role').select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin(Principal)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, approver } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      department: role !== 'Principal' ? department : undefined,
      approver: approver || undefined
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        approver: user.approver
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin(Principal)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      
      // Only check email if it's changing
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email.toLowerCase() });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = req.body.email.toLowerCase();
      }

      if (req.body.password) {
        user.password = req.body.password;
      }
      
      user.role = req.body.role || user.role;
      user.department = user.role !== 'Principal' ? (req.body.department || user.department) : undefined;
      user.approver = req.body.approver || user.approver;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        approver: updatedUser.approver
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin(Principal)
const deleteUser = async (req, res) => {
  try {
    // Avoid user deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    const result = await User.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available approvers for a role and department
// @route   GET /api/users/available-approvers
// @access  Private/Admin(Principal)
const getAvailableApprovers = async (req, res) => {
  try {
    const { role, department } = req.query;
    let query = {};

    if (role === 'Student') {
      // Students need Professors from their department
      query = { role: 'Professor', department };
    } else if (role === 'Professor') {
      // Professors need HODs from their department
      query = { role: 'HOD', department };
    } else if (role === 'HOD') {
      // HODs need Principal
      query = { role: 'Principal' };
    } else {
      return res.json([]); // Principals don't have an approver in this system
    }

    const approvers = await User.find(query).select('name email role department');
    res.json(approvers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAvailableApprovers
};
