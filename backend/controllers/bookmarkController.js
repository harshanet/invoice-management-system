const Bookmark = require('../models/Bookmark');

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).populate('resourceId');
    res.json(bookmarks);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const addBookmark = async (req, res) => {
  const { resourceId } = req.body;
  if (!resourceId) return res.status(400).json({ message: 'resourceId is required' });
  try {
    const existing = await Bookmark.findOne({ userId: req.user._id, resourceId });
    if (existing) return res.status(409).json({ message: 'Already bookmarked' });
    const bookmark = await Bookmark.create({ userId: req.user._id, resourceId });
    res.status(201).json(bookmark);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const result = await Bookmark.findOneAndDelete({
      userId:     req.user._id,
      resourceId: req.params.resourceId,
    });
    if (!result) return res.status(404).json({ message: 'Bookmark not found' });
    res.json({ message: 'Bookmark removed' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBookmarks, addBookmark, removeBookmark };
