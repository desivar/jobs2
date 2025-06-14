// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Correct path to your User model

// Helper to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ user: { id } }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body; // Added role for potential initial assignment

    if (!username || !password) {
        res.status(400);
        throw new Error('Please enter all required fields: username and password');
    }

    // Check if user already exists by username
    let userExists = await User.findOne({ username });
    if (userExists) {
        res.status(400);
        throw new Error('User with that username already exists');
    }

    // Check if email already exists if provided
    if (email) {
        userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User with that email already exists');
        }
    }

    // Create user (password will be hashed by pre-save hook in User model)
    const user = await User.create({
        username,
        email,
        password,
        role: role || 'user' // Default to 'user' if no role is provided
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            message: 'Registration successful!'
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Check for user by username
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            message: 'Login successful!'
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid username or password');
    }
});

module.exports = {
    registerUser,
    loginUser,
};