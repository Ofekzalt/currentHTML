// controllers/productController.js

const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const path = require('path');

// @desc    Fetch all products
// @route   GET /product-catalog
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res) => {
        const products = await Product.find();
        try {
            // Fetch the product by ID
            const product = await Product.findById(productId);
    
            if (!product) {
                console.log(`Product not found for ID: ${productId}`);
                return res.status(404).json({ error: 'Product not found' });
            }
    
            console.log(`Product found: ${product}`);
            res.status(200).json({ product });
    
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: error.message || 'An error occurred while retrieving the product.' });
        }
});

// @desc    Fetch single product by ID
// @route   GET /:productId
// @access  Public
exports.getProduct = async (req, res) => {
    const productId = req.params.productId;
    console.log(`Received request for product ID: ${productId}`);

    try {
        // Fetch the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            console.log(`Product not found for ID: ${productId}`);
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log(`Product found: ${product}`);
        res.status(200).json({ product });

    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: error.message || 'An error occurred while retrieving the product.' });
    }
};

// @desc    Create a new product
// @route   POST /
// @access  Admin
exports.createProduct = asyncHandler(async (req, res) => {
    const { name, sizes, caption, price, color, gender } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error('Image is required');
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const product = new Product({
        name,
        image: imagePath,
        sizes,
        caption,
        price,
        color,
        gender
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /:productId
// @access  Admin
exports.updateProduct = asyncHandler(async (req, res) => {
    const { name, sizes, caption, price, color, gender } = req.body;
    const product = await Product.findById(req.params.productId);

    if (product) {
        product.name = name || product.name;
        product.sizes = sizes || product.sizes;
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

// @desc    Delete a product
// @route   DELETE /:productId
// @access  Admin
exports.deleteProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found.'
            });
        }

        // Resolve the image path securely
        const imagePath = path.join(__dirname, '../public', product.image); // Adjust the path as needed

        // Delete the product from the database
        const result = await Product.deleteOne({ _id: productId });

        if (result.deletedCount > 0) {
            // Delete the image file
            try {
                await fs.unlink(imagePath);
                console.log('Image file deleted successfully');
            } catch (err) {
                console.error('Error deleting image file:', err);
                // Optionally, you can notify the user or admin about the image deletion failure
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
            error: error.message || 'An error occurred while deleting the product.'
        });
    }
};