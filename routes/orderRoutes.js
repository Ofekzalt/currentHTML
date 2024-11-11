const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { createOrder, getOrder, getUserOrders ,deleteOrder } = require("../controllers/orderController");

router.post('/', protect, createOrder);
// router.get('/allorders', protect, adminOnly, getAllOrders);

// Place the more specific route first
router.get('/orderHistory', protect, getUserOrders);

// Then define the parameterized routes
router.get('/:orderId', protect, adminOnly, getOrder);
router.delete('/:orderId', protect, adminOnly, deleteOrder);

module.exports = router;
