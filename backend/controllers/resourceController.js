const Resource = require('../models/Resource');

const getResources = async (req, res) => {
    try {
        const resources = await Resource.find({});
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getResources };
