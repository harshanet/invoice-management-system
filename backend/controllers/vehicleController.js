const Vehicle = require('../models/Vehicle');

// GET all available vehicles (Customer view)
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: 'available' });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all vehicles including retired (Admin view)
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new vehicle (Admin only)
const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update a vehicle (Admin only)
const updateVehicle = async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT retire a vehicle (Admin only - soft delete)
const retireVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: 'retired' },
      { new: true }
    );
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getVehicles,
  getAllVehicles,
  createVehicle,
  updateVehicle,
  retireVehicle,
};