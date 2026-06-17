const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check if the user token is valid
const protect = async (req, res, next) => {
    let token;

    // Check if the request has a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from the header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user details without the password
            req.user = await User.findById(decoded.id).select('-password');

            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // No token found
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };