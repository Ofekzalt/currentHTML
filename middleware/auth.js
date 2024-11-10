const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Optional Authentication Middleware
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token; // Assuming token is stored in cookies

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // Exclude password
    } catch (error) {
      console.error('Invalid token');
    }
  }
  next();
});

// Protect Middleware - Ensures user is authenticated
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // For APIs, you might return JSON
    return res.status(401).json({ error: { message: 'Not authorized, no token' } });
    // For web pages, you might redirect
    // return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ error: { message: 'User not found' } });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: { message: 'Not authorized, token failed' } });
  }
});

// Admin-Only Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: { message: 'Forbidden: Admins only' } });
    // For web pages, you might render an error page or redirect
    // res.status(403).render('403', { message: 'Forbidden' });
  }
};

module.exports = { optionalAuth, protect, adminOnly, generateToken };
