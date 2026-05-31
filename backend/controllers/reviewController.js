// =========================================================================
// reviewController.js
// Business logic for Review CRUD operations.
//
// Bidirectional review system -- customers review vehicles post-rental,
// administrators review customer conduct. Admin deletion restricted to
// flagged-abusive content only per Section 2.0 to prevent rating
// manipulation for commercial benefit (Sommerville, 2016).
// =========================================================================

const Review = require('../models/Review');

// POST /api/reviews - Customer or Admin.
// 201 Created on success (Fielding, 2000).
const createReview = async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      author: req.user._id,
      status: 'draft',
    });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/reviews - Both actors.
// Returns all published reviews visible to both user types.
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'published' })
      .populate('author', 'name')
      .populate('vehicle', 'make model');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/reviews/:id - Author only, before submission.
// Ownership enforced via findOne with author field.
const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.status !== 'draft')
      return res.status(400).json({ message: 'Only draft reviews can be edited' });
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/reviews/:id - Customer deletes own review.
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/reviews/:id/moderate - Admin only.
// Restricted to flagged reviews per Section 2.0 - prevents commercial rating manipulation.
const moderateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.status !== 'flagged')
      return res.status(400).json({ message: 'Only flagged reviews can be moderated' });
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Flagged review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  moderateReview,
};