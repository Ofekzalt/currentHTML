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
const preventOnline = require('../middleware/preventOnline');

// Public Routes
router.get('/', homePage);
router.get('/login',preventOnline, loginPage);
router.get('/register',preventOnline, registerPage);
router.get('/contact', contactPage);
router.get('/cart', cartPage);
router.get('/product', productPage);
router.get('/googlemaps', googlemapsPage);
router.get('/order', protect, orderPage);
router.get('/product-catalog', productCatalogPage);
router.get('/about', aboutPage);
 
// Admin-Only Routes
// router.get('/about', protect, adminOnly, aboutPage);
// router.get('/admin', protect, adminOnly, adminDashboard); // If used


module.exports = router;
