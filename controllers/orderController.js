const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = asyncHandler(async (req, res) => {
    console.log('Received req.body:', req.body);

    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        res.status(400);
        throw new Error('Products are required to create an order.');
    }

    try {
        let totalPrice = 0;
        let totalQuantity = 0;
        const validatedProducts = [];

        for (const item of products) {
            const { product: productId, quantity } = item;

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                res.status(400);
                throw new Error(`Invalid product ID format: ${productId}`);
            }
            if (!quantity || typeof quantity !== 'number' || quantity < 1) {
                res.status(400);
                throw new Error(`Invalid quantity for product ID: ${productId}`);
            }

            const product = await Product.findById(productId);
            if (!product) {
                res.status(404);
                throw new Error(`Product not found with ID: ${productId}`);
            }

            totalPrice += product.price * quantity;
            totalQuantity += quantity;

            validatedProducts.push({
                product: product._id,
                quantity,
            });
        }

        const order = new Order({
            user: req.user._id,
            products: validatedProducts,
            totalQuantity,
            totalPrice,
        });

        await order.save();
        await order.populate('products.product');

        res.status(201).json({
            message: 'Order created successfully.',
            order,
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500);
        throw new Error('An error occurred while creating the order.');
    }
});
exports.getOrder = async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid order ID format." });
    }

    try {
        const order = await Order.findById(orderId).populate('products.product');

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

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

// exports.getUserOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({ user: req.user.id })
//             .populate('products.product')
//             .sort({ createdAt: -1 });

//         if (!orders.length) {
//             return res.status(200).json({ message: "No orders found." });
//         }

//         res.status(200).json({
//             count: orders.length,
//             orders
//         });
//     } catch (error) {
//         console.error("Get user orders error:", error);
//         res.status(500).json({ 
//             message: "An error occurred while retrieving orders.", 
//             error: error.message 
//         });
//     }
// };


exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid order ID format." });
    }

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied." });
        }

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

// exports.getAllOrders = async (req, res) => {
//     try {
    
//         // Fetch all orders, populate products and user details, sort by latest
//         const orders = await Order.find()
//             .populate({
//                 path: 'products.product',
//                 select: 'name price' // Adjust fields to include product details
//             })
//             .populate({
//                 path: 'user',
//                 select: 'name email' // Adjust fields to include user details
//             })
//             .sort({ placedAt: -1 });

//         // If no orders are found, respond with a message
//         if (!orders.length) {
//             return res.status(200).json({ 
//                 message: "No orders found.", 
//                 count: 0 
//             });
//         }

//         // Return orders with a success message and count
//         res.status(200).json({
//             message: "Orders retrieved successfully.",
//             count: orders.length,
//             orders
//         });
//     } catch (error) {
//         console.error("Get all orders error:", error);

//         res.status(500).json({ 
//             message: "An error occurred while retrieving orders.", 
//             error: error.message 
//         });
//     }
// };

exports.getUserOrders = async (req, res) => {
    try {
        // Ensure req.user is defined
        if (!req.user) {
            return res.status(401).render('error', {
                message: 'User not authenticated',
                error: 'Please log in to view your orders.'
            });
        }

        const userId = req.user._id;

        // Fetch all orders for the logged-in user
        const orders = await Order.find({ user: userId })
            .populate({
                path: 'products.product',
                select: 'name price'
            })
            .sort({ createdAt: -1 }) // Use 'createdAt' if 'placedAt' doesn't exist
            .lean();

        // If no orders are found
        if (!orders.length) {
            return res.render('orderHistory', {
                orders: [],
                user: req.user,
                title: 'Order History',
                message: 'You have no orders.'
            });
        }

        // Render the template with orders
        res.render('orderHistory', {
            orders,
            user: req.user,
            title: 'Order History'
        });
    } catch (error) {
        console.error("Get user orders error:", error.stack);

        res.status(500).render('error', {
            message: "An error occurred while retrieving your orders.",
            error: error.message
        });
    }
};
