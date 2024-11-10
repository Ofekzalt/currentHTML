// routes/viewRoutes.js

const express = require('express');
const router = express.Router();
const {
  homePage,
  aboutPage,
  loginPage,
  registerPage,
  contactPage,
  cartPage,
  googlemapsPage,
  productPage,
  orderPage,
  productCatalogPage
} = require('../controllers/viewController');
const { protect, adminOnly } = require('../middleware/auth');

// Public Routes
router.get('/', homePage);
router.get('/login', loginPage);
router.get('/register', registerPage);
router.get('/contact', contactPage);
router.get('/cart', protect, cartPage);
router.get('/product', productPage);
router.get('/googlemaps', googlemapsPage);
router.get('/order', protect, orderPage); // Assuming orders require authentication
router.get('/product-catalog', productCatalogPage);

// Admin-Only Routes
router.get('/about', protect, adminOnly, aboutPage);
// router.get('/admin', protect, adminOnly, adminDashboard); // If used


module.exports = router;
