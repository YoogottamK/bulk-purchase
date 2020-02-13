const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = orderSchema;
