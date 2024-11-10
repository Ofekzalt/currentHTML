const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as needed

const preventOnline = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user) {
                // User is logged in, block access
                return res.status(403).json({ error: { message: 'Access denied for logged-in users' } });
                // Or redirect to another page for web apps
                // return res.redirect('/dashboard');
            }
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(403).json({ error: { message: 'Access denied for logged-in users' } });
        }
    }

    // If no token, allow the request to continue
    next();
});

module.exports = preventOnline;
