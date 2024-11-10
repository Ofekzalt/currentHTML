const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = asyncHandler(async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Concatenate error messages
      const errorMessages = errors.array().map((err) => err.msg).join(', ');
      return res.redirect(`/register?error=${encodeURIComponent(errorMessages)}`);
    }
  
    const { email, password } = req.body;
  
    // Check if user exists
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      return res.redirect(`/register?error=${encodeURIComponent('User already exists')}`);
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
  
      // Redirect to home with success message
      return res.status(200).redirect('/');
    } else {
      return res.redirect('/register');
    }
  });

exports.loginUser = asyncHandler(async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((err) => err.msg).join(', '));
  }

  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.cookie('token', generateToken(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
     res.redirect('/');
    return res.status(200).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
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