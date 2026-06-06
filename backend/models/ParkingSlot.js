const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
    slotNumber: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
