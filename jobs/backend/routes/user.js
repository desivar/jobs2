// backend/routes/user.js

const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserProfile,
    updateUserProfile,
    deleteUser,
} = require('../controllers/userController'); // Import your controller functions
const { protect, admin } = require('../middleware/authMiddleware'); // Import your authentication middleware

// Public authentication routes (Register/Login are usually in auth.js)
// router.post('/register', registerUser); // Moved to auth.js  <--- THIS IS LIKELY THE PROBLEM
// router.post('/login', loginUser);       // Moved to auth.js  <--- AND THIS

// Protected routes (require a valid JWT)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin-specific routes (require a valid JWT AND admin role)
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;