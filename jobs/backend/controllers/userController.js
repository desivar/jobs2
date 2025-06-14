// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Correct path to your User model

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin (requires 'admin' role)
const getUsers = asyncHandler(async (req, res) => {
    // The 'admin' middleware should already ensure the user has the 'admin' role
    const users = await User.find({}).select('-password'); // Fetch all users, exclude passwords
    res.status(200).json(users);
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private (requires authentication)
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is populated by the 'protect' middleware
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private (requires authentication)
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        // Only update password if provided and different
        if (req.body.password) {
            // The pre-save hook in the User model will hash this
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            message: 'Profile updated successfully'
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Private/Admin (requires 'admin' role)
const deleteUser = asyncHandler(async (req, res) => {
    // The 'admin' middleware ensures only admins can reach this
    const user = await User.findById(req.params.id);

    if (user) {
        await User.deleteOne({ _id: user._id }); // Use deleteOne for Mongoose 6+
        res.status(200).json({ message: 'User removed successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUsers,
    getUserProfile,
    updateUserProfile,
    deleteUser,
};