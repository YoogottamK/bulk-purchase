const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    state: {
        type: Number,
        required: true,
    },
    image: String,
    vendorId: {
        type: String,
        required: true,
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
