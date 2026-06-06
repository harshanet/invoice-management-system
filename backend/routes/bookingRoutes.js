const express = require('express');
const {
    createBooking,
    getUserBookings,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getUserBookings)
    .post(protect, createBooking);

router.route('/:id')
    .put(protect, updateBooking)
    .delete(protect, deleteBooking);

module.exports = router;
