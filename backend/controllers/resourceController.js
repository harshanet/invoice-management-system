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

const createResource = async (req, res) => {
    try {
        const { title, description, type, url, image, category, tags, difficulty } = req.body;
        if (!title || !url) return res.status(400).json({ message: 'Title and URL are required' });

        const resource = await Resource.create({
            title, description, type, url, image, category,
            tags: tags || [],
            difficulty,
            createdBy: req.user._id,
        });
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });

        const { title, description, type, url, image, category, tags, difficulty } = req.body;
        if (title)       resource.title       = title;
        if (description !== undefined) resource.description = description;
        if (type)        resource.type        = type;
        if (url)         resource.url         = url;
        if (image !== undefined) resource.image = image;
        if (category !== undefined) resource.category = category;
        if (tags)        resource.tags        = tags;
        if (difficulty)  resource.difficulty  = difficulty;

        const updated = await resource.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });
        res.json({ message: 'Resource deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getResources, getResourceById, createResource, updateResource, deleteResource };
