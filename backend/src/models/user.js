const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    isVendor: {
        type: Boolean,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        default: 0,
    },
    totalRating: {
        type: Number,
        default: 0,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
