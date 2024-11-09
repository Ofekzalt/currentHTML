const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        // Array of sizes and quantities for each product
        sizes: [{
            size: {
                type: String, 
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        }],
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    // shippingAddress: {
    //     type: String,
    //     required: true,
    // },
    placedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);