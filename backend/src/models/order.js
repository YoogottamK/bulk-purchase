const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
