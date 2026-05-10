const express = require('express');
const { createCategory, getCategories, getCategoryById, updateCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', protect, updateCategory);

module.exports = router;
