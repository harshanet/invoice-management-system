// =========================================================================
// Booking.js
// Mongoose schema for Booking documents.
//
// Mongoose enforces a schema layer over MongoDB's document model, providing
// type casting, validation, and middleware (Mongoose, 2026). Schema-first
// design centralises integrity rules at the model layer (Bais, 2024).
// =========================================================================

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // ObjectId reference enabling Mongoose's populate() join at query time
    // (Mongoose, 2026).
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Must match the model name registered in Vehicle.js.
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },

    // Date SchemaType auto-casts ISO 8601 strings from the request body.
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },

    // State machine per Section 2.0. Cancellation is a status transition,
    // not deletion, preserving the audit record.
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },

    notes: { type: String },

    // Records the initiating actor for the mutual-agreement cancellation rule.
    cancelledBy: {
      type: String,
      enum: ['customer', 'admin', null],
      default: null,
    },
  },
  // timestamps adds createdAt and updatedAt automatically (MongoDB, 2026).
  { timestamps: true }
);

// Lowercase plural collection name ('bookings') derived automatically
// (MongoDB, 2024).
module.exports = mongoose.model('Booking', bookingSchema);