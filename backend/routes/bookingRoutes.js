// =========================================================================
// bookingRoutes.js
// Express Router mapping HTTP endpoints to Booking controller handlers.
//
// Modular routing keeps server.js clean; each router is mounted at a path
// prefix (Express, 2026). URI design follows Fielding's (2000) resource-based
// naming -- plural nouns for collections, HTTP verbs for intent.
// =========================================================================

const express = require('express');
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
  deleteBooking,
} = require('../controllers/bookingController');

// protect verifies the JWT and attaches req.user; required on all routes.
const { protect } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id', protect, updateBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.delete('/:id', protect, deleteBooking);

// Admin route -- DELETE intentionally absent per Section 2.0.
router.get('/all', protect, getAllBookings);

module.exports = router;