const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  savedAt:    { type: Date, default: Date.now },
});

bookmarkSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
