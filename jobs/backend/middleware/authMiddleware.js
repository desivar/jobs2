// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // CORRECTED PATH: Assumes User.js is in backend/models/

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Use the same secret as generateToken. Ensure process.env.JWT_SECRET is set.
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

            // Find the user by ID from the decoded token payload
            // This 'decoded.id' assumes your JWT payload includes 'id' as the user's ID
            req.user = await User.findById(decoded.user.id).select('-password'); // Assuming 'decoded.user.id' from earlier JWT payload

            if (!req.user) {
                // If user doesn't exist for the given token ID
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Not authorized, token failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else { // Handle case where no token is provided in the header
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

module.exports = { protect };