// =========================================================================
// reviewRoutes.js
// Express Router for Review endpoints.
//
// URI design follows Fielding's (2000) resource-based naming. Admin
// moderation is a discrete sub-resource action (/moderate) rather than
// a plain DELETE to make the restricted intent explicit (Sahni, n.d.).
// =========================================================================

const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  moderateReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');

// Both actors.
router.get('/', protect, getReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);

// Customer only.
router.delete('/:id', protect, deleteReview);

// Admin only - flagged content moderation.
router.delete('/:id/moderate', protect, moderateReview);

module.exports = router;