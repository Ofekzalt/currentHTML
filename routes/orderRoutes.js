const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { createOrder, getOrder, getAllOrders, deleteOrder } = require("../controllers/orderController");

router.post('/', protect, createOrder);
router.get('/allorders', protect, adminOnly, getAllOrders); // Move this above
router.get('/:orderId', protect, adminOnly, getOrder);
router.delete('/:orderId', protect, adminOnly, deleteOrder);
// router.get('/', protect, adminOnly, getUserOrders)


module.exports = router;
