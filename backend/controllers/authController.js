// POST /api/auth/register - open endpoint, no authentication required.
// Self-registered accounts default to 'customer' role at the schema level.
// Admin accounts are provisioned directly in the database per Section 2.0.
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // .create() runs bcrypt pre-save middleware before persisting (Mongoose, 2026).
        const user = await User.create({ name, email, password });

        res.status(201).json({ // 201 Created per RFC 7231 (Fielding, 2000).
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Returned so AuthContext can render the correct actor interface immediately.
            token: generateToken(user.id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/auth/login - authenticates credentials and returns a signed JWT.
// Generic error message returned deliberately to avoid leaking account existence (Sommerville, 2016, Ch. 13).
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        // bcrypt.compare() performs constant-time hash comparison, mitigating timing attacks (Sommerville, 2016, Ch. 13).
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role, // Enables frontend actor differentiation per Section 2.0 two-actor requirement.
                token: generateToken(user.id) // JWT signed with JWT_SECRET, expires 30 days.
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' }); // 401 Unauthorised per RFC 7231 (Fielding, 2000).
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/auth/profile - retrieves the authenticated user's profile.
const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        name: user.name,
        email: user.email,
        university: user.university,
        address: user.address,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, university, address } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.university = university || user.university;
        user.address = address || user.address;

        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, university: updatedUser.university, address: updatedUser.address, token: generateToken(updatedUser.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
