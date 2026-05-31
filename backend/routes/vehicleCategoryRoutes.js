// =========================================================================
// vehicleCategoryRoutes.js
// Express Router for VehicleCategory endpoints.
//
// Modular routing keeps server.js clean (Express, 2026). URI design follows
// Fielding's (2000) resource-based naming convention.
// =========================================================================

const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/vehicleCategoryController');

const { protect } = require('../middleware/authMiddleware');

// Both actors - customers need categories for the filter dropdown.
router.get('/', protect, getCategories);

// Admin only.
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;