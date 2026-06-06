const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Protected
const createBooking = async (req, res) => {
    const { parkingSlotId, startTime, endTime } = req.body;
    try {
        const slot = await ParkingSlot.findById(parkingSlotId);
        if (!slot) {
            return res.status(404).json({ message: 'Parking slot not found' });
        }
        if (!slot.isAvailable) {
            return res.status(400).json({ message: 'Parking slot is already occupied' });
        }

        const booking = await Booking.create({
            user: req.user.id,
            parkingSlot: parkingSlotId,
            startTime,
            endTime
        });

        // Mark slot as unavailable
        slot.isAvailable = false;
        await slot.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's active bookings
// @route   GET /api/bookings
// @access  Protected
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('parkingSlot');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking times
// @route   PUT /api/bookings/:id
// @access  Protected
const updateBooking = async (req, res) => {
    const { startTime, endTime } = req.body;
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        // Check if the booking belongs to the authenticated user
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this booking' });
        }

        booking.startTime = startTime || booking.startTime;
        booking.endTime = endTime || booking.endTime;

        const updatedBooking = await booking.save();
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete/Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Protected
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        // Check if the booking belongs to the authenticated user
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to cancel this booking' });
        }

        // Release the slot
        const slot = await ParkingSlot.findById(booking.parkingSlot);
        if (slot) {
            slot.isAvailable = true;
            await slot.save();
        }

        await Booking.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Booking cancelled and slot released' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    updateBooking,
    deleteBooking
};
