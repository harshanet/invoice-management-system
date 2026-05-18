const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: { type: String },
    type:        { type: String, enum: ['article', 'video', 'course', 'book', 'tool', 'other'], default: 'other' },
    url:         { type: String, required: true },
    image:       { type: String },
    category:    { type: String },
    tags:        [{ type: String }],
    difficulty:  { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
