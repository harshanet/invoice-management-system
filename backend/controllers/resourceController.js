const Resource = require('../models/Resource');

const getResources = async (req, res) => {
    try {
        const { search, type, difficulty, category } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { title:       { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        if (type)       filter.type       = type;
        if (difficulty) filter.difficulty = difficulty;
        if (category)   filter.category   = { $regex: category, $options: 'i' };

        const resources = await Resource.find(filter);
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });
        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getResources, getResourceById };
