const Resource = require('../models/Resource');

const getResources = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = search
            ? { $or: [
                { title:       { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
              ] }
            : {};
        const resources = await Resource.find(filter);
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getResources };
