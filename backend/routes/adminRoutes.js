const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const Category = require('../models/Category');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/categories', protect, adminOnly, async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: 'resources',
                    let: { catName: '$name' },
                    pipeline: [{ $match: { $expr: { $eq: ['$category', '$$catName'] } } }],
                    as: 'resources',
                },
            },
            { $addFields: { resourceCount: { $size: '$resources' } } },
            { $project: { resources: 0 } },
            { $sort: { resourceCount: -1 } },
        ]);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const [resources, categories, users] = await Promise.all([
            Resource.countDocuments(),
            Category.countDocuments(),
            User.countDocuments(),
        ]);
        res.json({ resources, categories, users, bookmarks: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/resources/recent', protect, adminOnly, async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 }).limit(10);
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/resources', protect, adminOnly, async (req, res) => {
    try {
        const { search } = req.query;
        const filter = search
            ? { $or: [{ title: { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }] }
            : {};
        const resources = await Resource.find(filter).sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const { search } = req.query;
        const filter = search
            ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
            : {};
        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
        if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot change your own role' });
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot delete your own account' });
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
