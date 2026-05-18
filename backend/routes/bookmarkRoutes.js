const express = require('express');
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getBookmarks);
router.post('/', protect, addBookmark);
router.delete('/:resourceId', protect, removeBookmark);

module.exports = router;
