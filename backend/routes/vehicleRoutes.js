const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getAllVehicles,
  createVehicle,
  updateVehicle,
  retireVehicle,
} = require('../controllers/vehicleController');

const { protect } = require('../middleware/authMiddleware');

// Customer routes
router.get('/', protect, getVehicles);

// Admin routes
router.get('/all', protect, getAllVehicles);
router.post('/', protect, createVehicle);
router.put('/:id', protect, updateVehicle);
router.put('/:id/retire', protect, retireVehicle);

module.exports = router;