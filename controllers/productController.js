// controllers/productController.js

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs').promises;
const path = require('path');

/**
 * @desc    Get all products with pagination
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
    try {
        // Extract pagination parameters from query, set defaults if not provided
        const { page = 1, limit = 10 } = req.query;

        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Validate pagination parameters
        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ error: 'Invalid pagination parameters.' });
        }

        // Fetch products with pagination and populate category title
        const products = await Product.find()
            .populate('category', 'title')
            .limit(limitNumber)
            .skip((pageNumber - 1) * limitNumber)
            .exec();

        // Get total count of products for pagination info
        const totalCount = await Product.countDocuments();

        res.status(200).json({
            products,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Admin)
 */
const createProduct = async (req, res) => {
    try {
        // Ensure a file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Product image is required.' });
        }

        // Extract image path and sanitize it
        const imagePath = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes

        const { title, sizes, caption, price, category, color } = req.body;

        // Validate required fields
        if (!title || !sizes || !caption || !price || !category || !color) {
            // Optionally, delete the uploaded image if validation fails
            await fs.unlink(imagePath);
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate that 'category' is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(category)) {
            await fs.unlink(imagePath);
            return res.status(400).json({ message: 'Invalid category ID.' });
        }

        // Check if the category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            await fs.unlink(imagePath);
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Create the new product instance
        const product = new Product({
            title,
            image: imagePath,
            sizes,
            caption,
            price,
            color,
            category
        });

        // Save the product to the database
        const savedProduct = await product.save();

        res.status(201).json({ 
            message: 'Product created successfully.',
            product: savedProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        // Optionally, delete the uploaded image if an error occurs after upload
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting image after server error:', unlinkError);
            }
        }
        res.status(500).json({ error: 'An error occurred while creating the product.' });
    }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:productId
 * @access  Public
 */
const getProduct = async (req, res) => {
    const productId = req.params.productId;
    console.log(`Received request for product ID: ${productId}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID format.' });
    }

    try {
        // Fetch the product and populate category title
        const product = await Product.findById(productId).populate('category', 'title');

        if (!product) {
            console.log(`Product not found for ID: ${productId}`);
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the product.' });
    }
};

/**
 * @desc    Update a product by ID
 * @route   PUT /api/products/:productId
 * @access  Private (Admin)
 */
const updateProduct = async (req, res) => {
    const productId = req.params.productId;
    const { category } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    try {
        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // If category is being updated, validate its existence
        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: 'Invalid category ID format.' });
            }

            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(404).json({ message: 'Category not found.' });
            }
        }

        // Define fields allowed to be updated
        const allowedUpdates = ['title', 'sizes', 'caption', 'price', 'category', 'color', 'image'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // If image is being updated, handle old image deletion
        if (req.file) {
            const oldImagePath = path.resolve(__dirname, '..', product.image);
            updates.image = req.file.path.replace(/\\/g, '/');

            // Delete the old image file
            try {
                await fs.unlink(oldImagePath);
                console.log('Old image file deleted successfully.');
            } catch (err) {
                console.error('Error deleting old image file:', err);
                // Decide whether to proceed or return an error
                // For now, proceed and inform the client about the image deletion issue
            }
        }

        // Update the product with the allowed fields
        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true, runValidators: true });

        res.status(200).json({ 
            message: 'Product updated successfully.', 
            product: updatedProduct 
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'An error occurred while updating the product.' });
    }
};

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/products/:productId
 * @access  Private (Admin)
 */
const deleteProduct = async (req, res) => {
    const productId = req.params.productId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    try {
        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Resolve the image path securely
        const imagePath = path.resolve(__dirname, '..', product.image);

        // Delete the product from the database, triggering any middleware (like post-remove hooks)
        await product.remove();

        // Attempt to delete the image file
        try {
            await fs.unlink(imagePath);
            console.log('Image file deleted successfully.');
        } catch (err) {
            console.error('Error deleting image file:', err);
            // Decide whether to inform the client or log and proceed
            // For now, proceed and inform the client about the image deletion issue
        }

        res.status(200).json({ message: 'Product and its image were deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'An error occurred while deleting the product.' });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
};
