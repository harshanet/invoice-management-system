// =========================================================================
// vehicleCategoryController.js
// Business logic for VehicleCategory CRUD operations.
//
// Admin-only entity. Customers interact with categories indirectly via
// the vehicle filter on the browse screen (Section 2.0).
// Async/await with try/catch per Express error handling guidance
// (Express, 2026).
// =========================================================================

const VehicleCategory = require('../models/VehicleCategory');

// POST /api/categories - Admin only.
// 201 Created returned on successful resource creation (Fielding, 2000).
const createCategory = async (req, res) => {
  try {
    const category = new VehicleCategory(req.body);
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/categories - Both actors.
// Returns all categories for customer filter dropdown and admin management.
const getCategories = async (req, res) => {
  try {
    const categories = await VehicleCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/categories/:id - Admin only.
// { new: true } returns the updated document (Mongoose, 2026).
const updateCategory = async (req, res) => {
  try {
    const updated = await VehicleCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/categories/:id - Admin only.
// Hard delete is appropriate here as categories carry no audit obligation.
const deleteCategory = async (req, res) => {
  try {
    const deleted = await VehicleCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CommonJS named exports per Node.js module convention (Node.js, n.d.).
module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};