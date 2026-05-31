// =========================================================================
// Review.js
// Mongoose schema for Review documents.
//
// Bidirectional review system per Section 2.0 -- customers review vehicles,
// administrators review customer conduct. The reviewType field distinguishes
// the two directions (Section 2.0).
// =========================================================================

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // Author of the review - Customer or Admin.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Vehicle being reviewed - required for vehicle reviews,
    // null for conduct reviews.
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },

    // Customer being reviewed - required for conduct reviews,
    // null for vehicle reviews.
    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Distinguishes vehicle reviews (Customer) from conduct reviews (Admin).
    reviewType: {
      type: String,
      enum: ['vehicle', 'conduct'],
      required: true,
    },

    // Review content.
    comment: {
      type: String,
      required: true,
      trim: true,
    },

    // Star rating - applicable to vehicle reviews.
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // Publication state machine per Section 2.0.
    // draft -> submitted -> published -> flagged.
    status: {
      type: String,
      enum: ['draft', 'submitted', 'published', 'flagged'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);