const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');     // For creating JWTs
const bcrypt = require('bcryptjs');      // For password hashing (though handled by pre-save hook in model)

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // --- Validation ---
    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all required fields (username, password).' });
    }

    try {
        // Check if user already exists by username
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Check if email already exists (if provided)
        if (email) {
            let emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already registered.' });
            }
        }

        // Create new user (password hashing handled by pre-save hook in User model)
        user = new User({
            username,
            email,
            password // The pre-save hook in User.js will hash this
        });

        await user.save(); // Save the new user to MongoDB

        // Generate JWT token upon successful registration
        const token = jwt.sign(
            { id: user._id }, // Payload: user ID
            process.env.JWT_SECRET, // Secret key from your .env
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};


// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // --- Validation ---
    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter username and password.' });
    }

    try {
        // Check for user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Compare provided password with hashed password using the method from User model
        const isMatch = await user.matchPassword(password); // Using the custom method

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token upon successful login
        const token = jwt.sign(
            { id: user._id }, // Payload: user ID
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Logged in successfully!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};


// @desc    Get user profile (protected route example)
// @route   GET /api/users/me
// @access  Private (requires token)
const getMe = async (req, res) => {
    // req.user will be available from the auth middleware
    // We already attached the user object in the authMiddleware from the previous example.
    try {
        const user = await User.findById(req.user.id).select('-password'); // Get user by ID, exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({
            message: 'User data retrieved successfully!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error fetching user data.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe
};