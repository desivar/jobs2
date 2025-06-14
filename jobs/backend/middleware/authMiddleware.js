// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Correct path to your User model

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user from the token payload (excluding password) to the request object
            // The JWT payload we created used `user: { id: user.id }`
            req.user = await User.findById(decoded.user.id).select('-password');

            if (!req.user) {
                // If user doesn't exist for the given token ID
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next(); // Move to the next middleware or route handler
        } catch (error) {
            console.error('Authentication Error:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Middleware to check for admin role (COMMON for job trackers to have admins)
const admin = (req, res, next) => {
    // This assumes your User model has a 'role' field, and 'admin' is one of the roles
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403); // Forbidden
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin }; // Only export protect and admin for a typical job tracker