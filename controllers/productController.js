const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs').promises;


// exports.getAllProducts = asyncHandler(async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json(products);
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).json({ error: 'An error occurred while retrieving products.' });
//     }
// });


exports.getProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    console.log(`Received request for product ID: ${productId}`);

    try {
        const product = await Product.findById(productId);
        if (!product) {
            console.log(`Product not found for ID: ${productId}`);
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log(`Product found: ${product}`);
        res.status(200).json(product);

    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the product.' });
    }
});

exports.createProduct = asyncHandler(async (req, res) => {
    const { name, quantity, caption, price, color, gender } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error('Image is required');
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const product = new Product({
        name,
        image: imagePath,
        quantity,
        caption,
        price,
        color,
        gender
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const { name, quantity, caption, price, color, gender } = req.body;
    const product = await Product.findById(req.params.productId);

    if (product) {
        product.name = name || product.name;
        product.quantity = quantity !== undefined ? quantity : product.quantity; // Correctly handle 0 value
        product.caption = caption || product.caption;
        product.price = price || product.price;
        product.color = color || product.color;
        product.gender = gender || product.gender;

        if (req.file) {
            product.image = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const imagePath = path.join(__dirname, '../public', product.image); // Adjust the path as needed

        const result = await Product.deleteOne({ _id: productId });

        if (result.deletedCount > 0) {
            try {
                await fs.unlink(imagePath);
                console.log('Image file deleted successfully');
            } catch (err) {
                console.error('Error deleting image file:', err);
            }

            return res.status(200).json({
                message: `Product with _id: ${productId} and its image were deleted successfully.`
            });
        } else {
            return res.status(404).json({
                message: `Product with _id: ${productId} not found during deletion.`
            });
        }

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            error: 'An error occurred while deleting the product.'
        });
    }
});