// routes/viewRoutes.js

const express = require('express');
const router = express.Router();
const {
  homePage,
  aboutPage,
  loginPage,
  registerPage,
  adminDashboard,
  contactPage,
  cartPage,
  googlemapsPage,
  productPage
} = require('../controllers/viewController');
const { protect, adminOnly } = require('../middleware/auth');

// Public Routes
router.get('/', homePage);
router.get('/login', loginPage);
router.get('/register', registerPage);
router.get('/contact', contactPage);
router.get('/cart', cartPage);
router.get('/product', productPage);
router.get('/googlemaps', googlemapsPage);


// Admin-Only Routes
router.get('/about', protect, adminOnly, aboutPage);
router.get('/admin', protect, adminOnly, adminDashboard);

// Other routes as needed

module.exports = router;
