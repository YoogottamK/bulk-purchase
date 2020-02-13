const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    isVendor: {
        type: Boolean,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rating: String,
    reviews: [String],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
