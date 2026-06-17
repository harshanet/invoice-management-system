
/*const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;*/

const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/* Public routes */

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

/* Protected routes */

// Get user profile
router.get('/profile', protect, getProfile);

// Update user profile
router.put('/profile', protect, updateUserProfile);

module.exports = router;