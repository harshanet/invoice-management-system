// =========================================================================
// bookingController.js
// Business logic for Booking CRUD operations.
//
// Follows the MVC controller pattern (Sommerville, 2016, Ch. 17) and the
// modular controller convention from the sample application (Zwimber, 2018).
// Async/await with try/catch forwards errors as HTTP responses per Express
// asynchronous error handling guidance (Express, 2026).
// =========================================================================

const Booking = require('../models/Booking');

// POST /api/bookings -- Customer only.
// 201 Created per RFC 7231; customer field sourced from req.user to prevent
// cross-user booking (Fielding, 2000; Sahni, n.d.).
const createBooking = async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      customer: req.user._id,
      status: 'pending',
    });
    // .save() runs schema validators before persisting (Mongoose, 2026).
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/bookings/my -- Customer only.
// populate() embeds Vehicle fields, reducing frontend round-trips
// (Mongoose, 2026).
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('vehicle', 'make model pricePerDay');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/all -- Admin only.
// Populates both vehicle and customer references for the admin view.
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicle', 'make model pricePerDay')
      .populate('customer', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/bookings/:id -- Customer only, ownership-scoped.
// 404 returned for missing and unauthorised cases to avoid leaking resource
// existence (Fielding, 2000).
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ message: 'Cannot update a cancelled booking' });

    // { new: true } returns the updated document (Mongoose, 2026).
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/bookings/:id/cancel -- Customer and Admin.
// State transition only; record retained for audit compliance (Section 2.0).
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', cancelledBy: req.body.cancelledBy },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/bookings/:id -- Customer only.
// Admin deletion excluded at route and query layer per Section 2.0 audit
// compliance requirement.
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });
    if (!booking)
      return res.status(404).json({ message: 'Booking not found or not authorised' });
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CommonJS named exports per Node.js module convention (Node.js, n.d.).
module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
  deleteBooking,
};