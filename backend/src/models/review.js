const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    review: String,
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
