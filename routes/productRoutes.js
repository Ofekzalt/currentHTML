const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { 
    createProduct, 
    getProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const upload = require('../middleware/upload'); 

router.post('/', protect, adminOnly, upload.single('image'), createProduct); 

router.get('/:productId', getProduct); 

router.put('/:productId', protect, adminOnly, upload.single('image'), updateProduct); 

router.delete('/:productId', protect, adminOnly, deleteProduct); 

module.exports = router;
