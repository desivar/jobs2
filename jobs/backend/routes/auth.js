const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // If email is provided, check if it's already used
        if (email) {
            user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'Email already registered' });
            }
        }

        // Create new user instance (password will be hashed by pre-save hook)
        user = new User({ username, email, password });

        await user.save(); // Save the user to the database

        // Generate JWT token
        const payload = {
            user: {
                id: user.id // MongoDB's default _id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Your secret key from .env
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, message: 'Registration successful!' });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare entered password with hashed password
        const isMatch = await user.matchPassword(password); // Using the custom method from User model
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, message: 'Login successful!' });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;