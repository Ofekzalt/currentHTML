// app.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); // Import the package
const { optionalAuth } = require('./middleware/auth');
const viewRoutes = require('./routes/viewRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const morgan = require('morgan');


const app = express();

// Connect to Database
const connectDB = require('./DB/db');
const productRoutes = require('./routes/productRoutes');
const { log } = require('console');
connectDB();

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set(express.static(path.join(__dirname, 'public')));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Specify the default layout
app.set('layout', 'layout'); // Looks for views/layout.ejs

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Apply optionalAuth middleware to all routes
app.use(optionalAuth);

// Make user data available to all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', viewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // Prefixing user routes with /api
// app.use('/product', productRoutes);

// Error Handling Middleware (should be last)
app.use(errorHandler);

module.exports = app;
