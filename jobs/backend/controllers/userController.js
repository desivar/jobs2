// backend/controllers/userController.js

const User = require('../models/User'); // Path adjusted based on common structure
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Make sure this is installed: npm install express-async-handler

// @desc    Get all users (Admin only example)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // You might want to add a check here for admin role:
    // if (req.user.role !== 'admin') {
    //     return res.status(403).json({ message: 'Not authorized as an admin' });
    // }
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
});

// @desc    Get user profile (current logged-in user)
// @route   GET /api/users/profile
// @access  Private (accessible by the logged-in user)
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password; // Pre-save hook will hash this
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            message: 'Profile updated successfully'
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Delete a user (Admin only, or user deleting themselves)
// @route   DELETE /api/users/:id
// @access  Private/Admin or Private (self-deletion)
const deleteUser = asyncHandler(async (req, res) => {
    const userToDeleteId = req.params.id;
    // In a real app, you'd verify admin role here:
    // if (req.user.role !== 'admin' && req.user.id !== userToDeleteId) {
    //     return res.status(403).json({ message: 'Not authorized to delete this user' });
    // }
    const user = await User.findById(userToDeleteId);
    if (user) {
        await User.deleteOne({ _id: userToDeleteId });
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = {
    getUsers,
    getUserProfile,
    updateUserProfile,
    deleteUser,
};