const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = asyncHandler(async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Send validation error response
    return res.status(400).json({ message: errors.array().map((err) => err.msg).join(', ') });
  }

  const { email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    // Send error response
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = await User.create({
    email,
    password, // Password hashing handled in the model
  });

  if (user) {
    res.cookie('token', generateToken(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Send success response
    return res.status(201).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    return res.status(500).json({ message: 'Failed to create user' });
  }
});

  exports.loginUser = asyncHandler(async (req, res, next) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Send validation error response
      return res.status(400).json({ message: errors.array().map((err) => err.msg).join(', ') });
    }
  
    const { email, password } = req.body;
  
    try {
      // Check for user
      const user = await User.findOne({ email });
  
      if (user && (await user.matchPassword(password))) {
        // Set a cookie with the JWT token
        res.cookie('token', generateToken(user._id), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          sameSite: 'Strict',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
  
        // Send JSON response with user data
        return res.status(200).json({
          _id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        });
      } else {
        // Send error response for invalid credentials
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      // Handle any unexpected errors
      next(error);
    }
  });
exports.logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
  return res.redirect('/');
});