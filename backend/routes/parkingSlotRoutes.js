const express = require('express');
const {
    getAvailableParkingSlots,
    getAllParkingSlots,
    createParkingSlot,
    updateParkingSlot,
    deleteParkingSlot
} = require('../controllers/parkingSlotController');
const { protect } = require('../middleware/authMiddleware');

// Simple admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const router = express.Router();

router.route('/')
    .get(protect, getAllParkingSlots)
    .post(protect, admin, createParkingSlot);

router.route('/available')
    .get(getAvailableParkingSlots);

router.route('/:id')
    .put(protect, admin, updateParkingSlot)
    .delete(protect, admin, deleteParkingSlot);

module.exports = router;
