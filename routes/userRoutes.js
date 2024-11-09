// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { deleteUser, updateUser } = require('../controllers/userController');
const { updateUserValidation } = require('../validation/userValidation');

// Admin-Only Routes
router.delete('/users/delete/:id', protect, adminOnly, deleteUser);
router.put('/users/update/:id', protect, adminOnly, updateUserValidation, updateUser);

module.exports = router;
