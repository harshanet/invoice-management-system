const express = require('express');
const { getResources, getResourceById, createResource, updateResource, deleteResource } = require('../controllers/resourceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/', protect, adminOnly, createResource);
router.put('/:id', protect, adminOnly, updateResource);
router.delete('/:id', protect, adminOnly, deleteResource);

module.exports = router;
