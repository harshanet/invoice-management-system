const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parkingSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
