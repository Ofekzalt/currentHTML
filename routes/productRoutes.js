// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { 
    createProduct, 
    getProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const upload = require('../middleware/upload'); // Middleware for handling file uploads

// Fetch all products - Note: The route in `viewRoutes.js` handles rendering
// If you have an API endpoint, you can define it separately, e.g., /api/products
// For now, keeping as per your existing setup

// Create a new product (Protected & Admin Only)
router.post('/', protect, adminOnly, upload.single('image'), createProduct); 

// Fetch a single product by ID
router.get('/:productId', getProduct); 

// Update a product by ID (Protected & Admin Only)
router.put('/:productId', protect, adminOnly, upload.single('image'), updateProduct); 

// Delete a product by ID (Protected & Admin Only)
router.delete('/:productId', protect, adminOnly, deleteProduct); // DELETE /product-catalog/:productId

module.exports = router;
