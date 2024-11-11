// app.js

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { optionalAuth } = require('./middleware/auth'); // Ensure this is correctly defined
const viewRoutes = require('./routes/viewRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

// Connect to Database
const connectDB = require('./DB/db');
const productRoutes = require('./routes/productRoutes');
connectDB();

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Specify the default layout
app.set('layout', 'layout'); // or 'layout/layout' based on your directory structure

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Apply optionalAuth middleware to all routes
app.use(optionalAuth);

// Make user data available to all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.WEATHER_API = process.env.WEATHER_API|| null;
  next();
});


//Weather API

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API}&units=metric`;

    const response = await axios.get(apiUrl);

    if (response.data.cod === "404") {
      return res.status(404).json({ error: 'City not found' });
    }

    const data = response.data;
    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Could not fetch the weather data. Please try again later.' });
  }
});

// Routes
app.use('/', viewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // Prefixing user routes with /api
app.use('/product', productRoutes); // Mount product routes on /product
app.use('/order', orderRoutes);     // Mount order routes on /order

// Error Handling Middleware (should be last)
app.use(errorHandler);

module.exports = app;
