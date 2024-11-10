// controllers/viewsController.js

const Product = require('../models/Product');

exports.homePage = (req, res) => {
  res.render('home', { title: 'Home' });
};

exports.aboutPage = (req, res) => {
  res.render('about', { title: 'About' });
};

exports.loginPage = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.registerPage = (req, res) => {
  res.render('register', { title: 'Register' });
};

// exports.adminDashboard = (req, res) => {
//   res.render('adminDashboard', { title: 'Admin Dashboard' });
// };

exports.contactPage = (req, res) => {
  res.render('contact', { title: 'Contact Page' });
};

exports.cartPage = (req, res) => {
  res.render('cart', { title: 'Cart Page' });
};

exports.productPage = (req, res) => {
  res.render('product', { title: 'Product Page' });
};

exports.orderPage = (req, res) => {
  res.render('order', { title: 'Order Page' });
};

exports.googlemapsPage = (req, res) => {
  console.log(process.env.GOOGLE_MAP_KEY);
  res.render('googlemaps', { title: 'Google Maps Page', GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY });
};

exports.productCatalogPage = async (req, res) => {
  try {
      const products = await Product.find(); 
      res.render('productCatalog', {
          title: 'Product Catalog',
          stylesheet: 'productCatalog.css',
          script: 'productCatalog.js',
          products
      });
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
};
