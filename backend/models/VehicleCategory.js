// =========================================================================
// VehicleCategory.js
// Mongoose schema for VehicleCategory documents.
//
// Categories organise the vehicle fleet into filterable groups, enabling
// customer-side search and admin-side fleet reporting (Section 2.0).
// Schema-first design centralises integrity rules at the model layer
// (Bais, 2024).
// =========================================================================

const mongoose = require('mongoose');

const vehicleCategorySchema = new mongoose.Schema(
  {
    // Category name (must be unique to prevent duplicate entries.)
    // Examples: 'SUV', 'Sedan', 'Hybrid', 'Electric'.
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Optional description for admin reference.
    description: {
      type: String,
      trim: true,
    },
  },
  // timestamps adds createdAt and updatedAt automatically (MongoDB, 2026).
  { timestamps: true }
);

module.exports = mongoose.model('VehicleCategory', vehicleCategorySchema);