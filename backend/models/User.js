const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    university: { type: String },
    address: { type: String },
    // Role field distinguishes Customer and Administrator actors.
    // Defaults to 'customer' on registration. Admin accounts are
    // provisioned directly in the database per Section 2.0.
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);