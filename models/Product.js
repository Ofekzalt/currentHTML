// models/Product.js

const mongoose = require("mongoose");

const sizeEnumEU = [35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46, 46.5];
const genderEnum = ['Male', 'Female', 'Unisex'];

const productSchema = new mongoose.Schema({
    name: {  // Changed from 'title' to 'name'
        type: String,
        required: [true, 'Product name is required.'],
        trim: true
    },
    image: {
        type: String, // URL or file path
        required: [true, 'Product image is required.'],
        trim: true
    },
    sizes: {
        type: [Number],
        enum: {
            values: sizeEnumEU,
            message: '{VALUE} is not a valid EU size.'
        },
        required: [true, 'Product sizes are required.']
    },
    caption: {
        type: String,
        required: [true, 'Product caption is required.'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required.'],
        min: [0, 'Price cannot be negative.']
    },
    color: {
        type: String,
        required: [true, 'Product color is required.'],
        trim: true
    },
    gender: { 
        type: String,
        enum: {
            values: genderEnum,
            message: '{VALUE} is not a valid gender.'
        },
        required: [true, 'Product gender is required.'],
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
