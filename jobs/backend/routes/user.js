// backend/routes/user.js
const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserProfile,
    updateUserProfile,
    deleteUser,
} = require('../controllers/userController'); // Ensure correct path and destructuring
const { protect, admin } = require('../middleware/authMiddleware'); // Ensure correct path and destructuring

// Protected routes (require valid JWT)
router.get('/profile', protect, getUserProfile); // GET /api/users/profile
router.put('/profile', protect, updateUserProfile); // PUT /api/users/profile

// Admin-specific routes (require valid JWT AND admin role)
router.get('/', protect, admin, getUsers); // GET /api/users
router.delete('/:id', protect, admin, deleteUser); // DELETE /api/users/:id

module.exports = router;