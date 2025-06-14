const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures no two users have the same username
        trim: true // Removes whitespace from start/end
    },
    password: {
        type: String,
        required: true
    },
    email: { // Optional but good for registration
        type: String,
        required: false, // Make it false if you only want username for login
        unique: true,
        sparse: true, // Allows multiple documents to have a null value for email
        trim: true,
        lowercase: true // Store emails in lowercase
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to hash password before saving to the database
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) { // Only hash if password field is modified
        next();
    }
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
});

// Method to compare entered password with hashed password in the database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;