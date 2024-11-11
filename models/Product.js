const mongoose = require("mongoose");
const genderEnum = ['Male', 'Female', 'Unisex'];

const productSchema = new mongoose.Schema({
    name: {  
        type: String,
        required: [true, 'Product name is required.'],
        trim: true
    },
    image: {
        type: String, 
        required: [true, 'Product image is required.'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required.'],
        min: [0, 'Quantity cannot be negative.'],
        default: 0 
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
