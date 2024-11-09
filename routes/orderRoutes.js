const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { createOrder, getOrder, getUserOrders, deleteOrder } = require("../controllers/orderController");

router.post('/',protect, createOrder);
router.get('/orderId', protect, adminOnly, getOrder);
router.get('/', protect, adminOnly, getUserOrders)
router.delete('/orderId', protect, adminOnly, deleteOrder);

module.exports = router;
