const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    description: String,
});

const Review = mongoose.Model("Review", reviewSchema);

module.exports = Review;
