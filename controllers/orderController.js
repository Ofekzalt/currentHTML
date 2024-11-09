// controllers/orderController.js

const mongoose = require('mongoose');
const Order = require("../models/Order");
const Product = require("../models/Product"); // Import Product model to validate products
const fs = require('fs').promises;
const path = require('path');

/**
 * @desc    Create a new order based on the provided products
 * @route   POST /api/orders/
 * @access  Private (Authenticated Users)
 */
exports.createOrder = async (req, res) => {
    try {
        const { products } = req.body;

        // Validate request body
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products are required to create an order." });
        }

        // Initialize total price
        let totalPrice = 0;

        // Array to hold validated products        const validatedProducts = [];

        // Iterate over each product to validate and calculate total price
        for (const item of products) {
            const { product: productId, quantity } = item;

            // Validate product ID and quantity
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: `Invalid product ID format: ${productId}` });
            }

            if (!quantity || typeof quantity !== 'number' || quantity < 1) {
                return res.status(400).json({ message: `Invalid quantity for product ID: ${productId}` });
            }

            // Fetch the product from the database
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: `Product not found with ID: ${productId}` });
            }

            // Calculate total price
            totalPrice += product.price * quantity;

            // Push validated product details
            validatedProducts.push({
                product: product._id,
                quantity
            });
        }

        // Create the order
        const order = new Order({
            user: req.user.id,
            products: validatedProducts,
            totalPrice,
        });

        await order.save();

        // Optionally, populate the order's products for response
        await order.populate('products.product');

        res.status(201).json({
            message: "Order created successfully.",
            order
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ 
            message: "An error occurred while creating the order.", 
            error: error.message 
        });
    }
};

/**
 * @desc    Get a specific order by ID
 * @route   GET /api/orders/:orderId
 * @access  Private (Order Owner or Admin)
 */
exports.getOrder = async (req, res) => {
    const { orderId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid order ID format." });
    }

    try {
        const order = await Order.findById(orderId).populate('products.product');

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Check if the requesting user is the owner or an admin
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied." });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({ 
            message: "An error occurred while retrieving the order.", 
            error: error.message 
        });
    }
};

/**
 * @desc    Get all orders for the authenticated user
 * @route   GET /api/orders/
 * @access  Private (Authenticated Users)
 */
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('products.product')
            .sort({ createdAt: -1 }); // Sort by latest orders first

        if (orders.length === 0) {
            return res.status(200).json({ message: "No orders found." });
        }

        res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ 
            message: "An error occurred while retrieving orders.", 
            error: error.message 
        });
    }
};

/**
 * @desc    Delete a specific order by ID
 * @route   DELETE /api/orders/:orderId
 * @access  Private (Admin Only)
 */
exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid order ID format." });
    }

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Check if the requesting user is the owner or an admin
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied." });
        }

        // If your Order model has associated images or other resources, handle their deletion here
        // Example:
        // const imagePath = path.resolve(__dirname, '..', order.image);
        // await fs.unlink(imagePath).catch(err => console.error('Error deleting order image:', err));

        // Delete the order from the database
        await Order.findByIdAndDelete(orderId);

        res.status(200).json({ message: "Order successfully deleted." });
    } catch (error) {
        console.error("Delete order error:", error);
        res.status(500).json({ 
            message: "An error occurred while deleting the order.", 
            error: error.message 
        });
    }
};
