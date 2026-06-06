const ParkingSlot = require('../models/ParkingSlot');

// @desc    Get all available slots (for users)
// @route   GET /api/slots/available
// @access  Public
const getAvailableParkingSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot.find({ isAvailable: true });
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all slots (for admin)
// @route   GET /api/slots
// @access  Protected
const getAllParkingSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot.find({});
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a parking slot
// @route   POST /api/slots
// @access  Protected (Admin only)
const createParkingSlot = async (req, res) => {
    const { slotNumber, location, pricePerHour, isAvailable } = req.body;
    try {
        const slotExists = await ParkingSlot.findOne({ slotNumber });
        if (slotExists) {
            return res.status(400).json({ message: 'Slot number already exists' });
        }
        const slot = await ParkingSlot.create({
            slotNumber,
            location,
            pricePerHour,
            isAvailable: isAvailable !== undefined ? isAvailable : true
        });
        res.status(201).json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a parking slot
// @route   PUT /api/slots/:id
// @access  Protected (Admin only)
const updateParkingSlot = async (req, res) => {
    const { slotNumber, location, pricePerHour, isAvailable } = req.body;
    try {
        const slot = await ParkingSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }
        slot.slotNumber = slotNumber || slot.slotNumber;
        slot.location = location || slot.location;
        slot.pricePerHour = pricePerHour !== undefined ? pricePerHour : slot.pricePerHour;
        slot.isAvailable = isAvailable !== undefined ? isAvailable : slot.isAvailable;

        const updatedSlot = await slot.save();
        res.status(200).json(updatedSlot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a parking slot
// @route   DELETE /api/slots/:id
// @access  Protected (Admin only)
const deleteParkingSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }
        await ParkingSlot.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Slot removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAvailableParkingSlots,
    getAllParkingSlots,
    createParkingSlot,
    updateParkingSlot,
    deleteParkingSlot
};
