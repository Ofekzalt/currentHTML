const mongoose = require("mongoose");

const sizeEnumEU = [35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46, 46.5];

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    sizes: {
        type: [Number],
        enum: sizeEnumEU, 
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Product', productSchema);